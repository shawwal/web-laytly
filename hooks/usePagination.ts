// hooks/usePagination.ts
import { useState } from "react";

export function usePagination(initialLimit = 30) {
  const [currentOffset, setCurrentOffset] = useState(0);
  const [limit] = useState(initialLimit);

  const fetchOlderMessages = () => {
    setCurrentOffset(prevOffset => prevOffset + limit);
  };

  const resetPagination = () => {
    setCurrentOffset(0);
  };

  return {
    currentOffset,
    limit,
    fetchOlderMessages,
    resetPagination,
  };
}
