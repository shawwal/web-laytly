'use client'

import { useState, useEffect, useCallback } from 'react';
import useSession from '@/hooks/useSession'; // Your hook
import { supabase } from '@/lib/supabase';
import LoadingOverlay from '@/components/loading-overlay';
import FeatureRequestList from '@/components/feature-request-list';
import NewFeatureRequestForm from '@/components/new-feature-request-form'; // Adjust path
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { FeatureRequest } from '@/types/feature-request';

// Define types for clarity (adjust based on your actual Supabase schema if needed)

export default function FeatureRequestPage() {
  const { session, loading: sessionLoading } = useSession();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!session?.user) return; // Don't fetch if user isn't loaded

    setLoadingRequests(true);
    setError(null);

    try {
      // Fetch requests and the current user's vote for each request
      const { data: requestsData, error: requestsError } = await supabase
        .from('feature_requests')
        .select(`
          *,
          feature_request_votes (
            vote_type
          )
        `)
        // Optionally filter by status, order, etc.
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Map data to include user_vote directly
      const mappedRequests = requestsData.map(req => {
        // The result for the join is an array, we expect 0 or 1 item
        const userVoteRecord = req.feature_request_votes && req.feature_request_votes.length > 0
          ? req.feature_request_votes[0]
          : null;
        return {
          ...req,
          // Remove the nested array structure
          feature_request_votes: undefined,
          // Add user_vote property
          user_vote: userVoteRecord ? userVoteRecord.vote_type : null,
        } as FeatureRequest; // Cast to ensure type correctness
      });


      setRequests(mappedRequests);

    } catch (err: any) {
      console.error('Error fetching feature requests:', err);
      setError('Failed to load feature requests. Please try again.');
    } finally {
      setLoadingRequests(false);
    }
  }, [session, supabase]); // Depend on session and supabase client


  useEffect(() => {
    if (!sessionLoading && session) {
      fetchRequests();
    }
    // If session is loaded but there's no user, handle appropriately
    if (!sessionLoading && !session) {
        setLoadingRequests(false);
        // Optionally redirect to login or show a message
    }
  }, [sessionLoading, session, fetchRequests]);

  const handleVote = async (requestId: string, voteType: 1 | -1 | null) => {
      if (!session?.user) return; // Must be logged in

      const userId = session.user.id;
      const currentRequest = requests.find(r => r.id === requestId);
      if (!currentRequest) return;

      const currentVote = currentRequest.user_vote;

      try {
          // Optimistic UI update
          const updatedRequests = requests.map(r => {
              if (r.id === requestId) {
                  let newLikeCount = r.like_count;
                  let newDislikeCount = r.dislike_count;
                  let newUserVote: number | null = voteType;

                  // Adjust counts based on the change
                  if (voteType === currentVote) { // Undoing vote
                      newUserVote = null;
                      if (voteType === 1) newLikeCount--;
                      if (voteType === -1) newDislikeCount--;
                  } else { // Adding or changing vote
                      if (currentVote === 1) newLikeCount--; // Remove previous like
                      if (currentVote === -1) newDislikeCount--; // Remove previous dislike
                      if (voteType === 1) newLikeCount++; // Add new like
                      if (voteType === -1) newDislikeCount++; // Add new dislike
                  }

                  return {
                      ...r,
                      like_count: Math.max(0, newLikeCount), // Ensure non-negative
                      dislike_count: Math.max(0, newDislikeCount), // Ensure non-negative
                      user_vote: newUserVote,
                  };
              }
              return r;
          });
          setRequests(updatedRequests);

          // --- Database Operations ---

          if (voteType === null) {
              // Delete the existing vote
              const { error: deleteError } = await supabase
                  .from('feature_request_votes')
                  .delete()
                  .match({ user_id: userId, request_id: requestId });
              if (deleteError) throw deleteError;
          } else {
              // Upsert the vote (insert or update if exists)
              const { error: upsertError } = await supabase
                  .from('feature_request_votes')
                  .upsert(
                      { user_id: userId, request_id: requestId, vote_type: voteType },
                      { onConflict: 'user_id, request_id' } // Use the unique constraint
                  );
              if (upsertError) throw upsertError;
          }

          // --- Update Denormalized Counts using RPC ---
          const { error: rpcError } = await supabase.rpc('update_feature_request_vote_counts', {
              request_uuid: requestId
          });
          if (rpcError) {
              console.warn("Failed to update counts via RPC, counts might be stale until next fetch:", rpcError);
              // Optionally trigger a refetch here or show a warning
              // fetchRequests(); // Could cause rapid refetches, use with caution
          } else {
              // Optional: If RPC succeeds, could refetch just this one item for guaranteed consistency
              // or trust the optimistic update for now.
          }

      } catch (err: any) {
          console.error('Error handling vote:', err);
          setError('Failed to process vote.');
          // Revert optimistic update on error
          setRequests(requests);
      }
  };


  const handleRequestAdded = () => {
    setShowForm(false); // Hide form after submission
    fetchRequests(); // Refresh the list
  };

  // Handle initial loading state for session
  if (sessionLoading) {
    return <LoadingOverlay />;
  }

  // Handle user not logged in
  if (!session || !session.user) {
    // Option 1: Show login prompt
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <h1 className="text-2xl font-bold mb-4">Feature Requests</h1>
            <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
                Please log in to view and submit feature requests.
            </p>
            {/* Add a Link to your login page here */}
            {/* <Link href="/login"><Button>Log In</Button></Link> */}
        </div>
    );
    // Option 2: Redirect (less user-friendly without context)
    // import { redirect } from 'next/navigation';
    // redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-6 md:px-6 md:py-8 mb-16 sm:mb-0 flex-grow"> {/* flex-grow to push footer down */}
        <div className="max-w-3xl mx-auto">
           <div className="flex justify-between items-center mb-6">
             <h1 className="text-2xl font-bold">Feature Requests</h1>
             <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
               <PlusCircle className={`mr-2 h-4 w-4 transition-transform ${showForm ? 'rotate-45' : ''}`} />
               {showForm ? 'Cancel' : 'New Request'}
             </Button>
           </div>

           {showForm && (
             <div className="mb-8">
                <NewFeatureRequestForm
                    userId={session.user.id}
                    onSuccess={handleRequestAdded}
                />
              </div>
           )}

          {loadingRequests && !error && <p className="text-center text-gray-500 dark:text-gray-400">Loading requests...</p>}
          {error && <p className="text-center text-red-500 dark:text-red-400">{error}</p>}

          {!loadingRequests && !error && requests.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No feature requests submitted yet. Be the first!
            </p>
          )}

          {!loadingRequests && !error && requests.length > 0 && (
            <FeatureRequestList requests={requests} onVote={handleVote} currentUserId={session.user.id}/>
          )}
        </div>
      </div>
      {/* Optional Footer */}
      {/* <footer className="p-4 bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        Your App Footer
      </footer> */}
    </div>
  );
}