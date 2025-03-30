'use client'

// --- Core React/Next Imports ---
import { useState, useEffect } from 'react';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// --- Icons ---
import { ThumbsUp, ThumbsDown, MessageSquare, User, Calendar } from 'lucide-react';

// --- Utilities ---
import { formatDistanceToNow } from 'date-fns';

// --- Types ---
import { FeatureRequest } from '@/types/feature-request'; // Make sure this type includes user_id: string | null

// --- Supabase Client (Using the direct import from your example) ---
import { supabase } from '@/lib/supabase'; // Ensure this path is correct

// --- Constants ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; // Read from environment variable
const AVATARS_BUCKET_NAME = 'avatars'; // CHANGE THIS IF YOUR BUCKET NAME IS DIFFERENT

// --- Profile Data Structure ---
interface SubmitterProfile {
  id: string;
  full_name?: string | null; // Adjust if your column name is different (e.g., username)
  avatar_url?: string | null; // This should store the PATH to the file (e.g., 'user1/avatar.png')
}

// --- Props Definition ---
interface FeatureRequestItemProps {
  request: FeatureRequest;
  onVote: (requestId: string, voteType: 1 | -1 | null) => void;
  currentUserId: string;
}

// --- Helper Function for Avatar Fallback ---
const getInitials = (name?: string | null): string => {
  if (!name) return '';
  const names = name.trim().split(' ');
  if (names.length === 1 && names[0] !== '') return names[0].charAt(0).toUpperCase();
  if (names.length > 1) return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  return '';
};

// --- Component Implementation ---
export default function FeatureRequestItem({ request, onVote, currentUserId }: FeatureRequestItemProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [submitterProfile, setSubmitterProfile] = useState<SubmitterProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const timeAgo = request.created_at ? formatDistanceToNow(new Date(request.created_at), { addSuffix: true }) : '';

  // --- useEffect Hook to Fetch Profile ---
  useEffect(() => {
    const fetchSubmitterProfile = async () => {
      if (!request.user_id || typeof request.user_id !== 'string' || request.user_id.trim() === '') {
        setLoadingProfile(false);
        setSubmitterProfile(null);
        return;
      }

      setLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from('profiles') // Ensure 'profiles' is your correct table name
          .select('id, full_name, avatar_url') // Adjust columns if needed
          .eq('id', request.user_id)
          .single();

        if (error && error.code !== 'PGRST116') { // Ignore '0 rows' error
          console.error(`Error fetching profile for user ${request.user_id}:`, error.message);
          throw error;
        }
        setSubmitterProfile(data);

      } catch (err) {
        console.error("Failed to load submitter profile:", err);
        setSubmitterProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchSubmitterProfile();

  }, [request.user_id, supabase]); // Dependency on user_id and the imported supabase instance

  // --- Calculate Avatar Source URL ---
  let avatarSrc: string | undefined = undefined;
  // Construct URL only if base URL and avatar path are available
  if (SUPABASE_URL && submitterProfile?.avatar_url) {
    avatarSrc = `${SUPABASE_URL}/storage/v1/object/public/${AVATARS_BUCKET_NAME}/${submitterProfile.avatar_url}`;
  }
  // --- End Calculate Avatar Source URL ---

  const handleVoteClick = async (voteType: 1 | -1) => {
    if (isVoting) return;
    setIsVoting(true);
    const newVoteType = request.user_vote === voteType ? null : voteType;
    await onVote(request.id, newVoteType);
    setIsVoting(false);
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{request.title}</CardTitle>

        {/* --- Dynamic Submitter Info Section --- */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-x-4 gap-y-1 pt-1 flex-wrap">
          {/* User Avatar and Name */}
          <div className='flex items-center gap-1.5 min-w-[100px]'>
            {loadingProfile ? (
              // Loader Skeleton
              <>
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </>
            ) : submitterProfile || request.user_id ? (
               // Profile Found or user_id exists (even if profile load failed): Display Avatar and Name/Fallback
              <>
                <Avatar className="h-4 w-4">
                  {/* --- CORRECTED AvatarImage src --- */}
                  <AvatarImage
                    src={avatarSrc} // Use the calculated src
                    alt={submitterProfile?.full_name ?? 'User avatar'}
                  />
                  {/* --- End CORRECTION --- */}
                  <AvatarFallback className="text-[8px] leading-tight flex items-center justify-center">
                     {/* Fallback shows initials if profile loaded, otherwise User icon */}
                     {submitterProfile ? getInitials(submitterProfile.full_name) : <User size={10} />}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{submitterProfile?.full_name || `User ${request.user_id?.substring(0, 6)}...`}</span>
              </>
            ) : (
               // Fallback if NO user_id was associated with the request
               <>
                 <span className="flex items-center justify-center h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
                    <User size={10} />
                 </span>
                 <span>System/Unknown</span>
               </>
            )}
          </div>

          {/* Timestamp */}
          <div className='flex items-center gap-1'>
             <Calendar size={12} />
             <span>{timeAgo || <Skeleton className="h-4 w-16"/>}</span>
          </div>
        </div>
        {/* --- End Submitter Info Section --- */}

      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {request.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* --- Voting Buttons (Unchanged) --- */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVoteClick(1)}
            disabled={isVoting}
            className={`flex items-center space-x-1 px-2 py-1 h-auto rounded-md transition-colors ${
                request.user_vote === 1
                ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ThumbsUp size={16} className={isVoting && request.user_vote !== 1 ? 'animate-pulse' : ''} />
            <span>{request.like_count ?? 0}</span>
          </Button>
          <Button
             variant="ghost"
             size="sm"
             onClick={() => handleVoteClick(-1)}
             disabled={isVoting}
             className={`flex items-center space-x-1 px-2 py-1 h-auto rounded-md transition-colors ${
                 request.user_vote === -1
                 ? 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800'
                 : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
             }`}
           >
            <ThumbsDown size={16} className={isVoting && request.user_vote !== -1 ? 'animate-pulse' : ''} />
            <span>{request.dislike_count ?? 0}</span>
          </Button>
        </div>
        {/* --- Status (Unchanged) --- */}
         <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
             {request.status || 'Open'}
         </span>
      </CardFooter>
    </Card>
  );
}