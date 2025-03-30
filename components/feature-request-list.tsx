'use client'

import FeatureRequestItem from '@/components/feature-request-item'; // Import the FeatureRequestItem component
import { FeatureRequest } from '@/types/feature-request';

interface FeatureRequestListProps {
  requests: FeatureRequest[];
  onVote: (requestId: string, voteType: 1 | -1 | null) => void; // Pass vote handler
  currentUserId: string;
}

export default function FeatureRequestList({ requests, onVote, currentUserId }: FeatureRequestListProps) {
  if (!requests || requests.length === 0) {
    return null; // Or a message, handled by parent page currently
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <FeatureRequestItem
            key={request.id}
            request={request}
            onVote={onVote}
            currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}