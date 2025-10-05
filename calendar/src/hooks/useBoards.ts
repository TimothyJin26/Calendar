import { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listBoards } from '../graphql/queries';
import type { ListBoardsQuery } from '../graphql/API';

const client = generateClient();

type Board = NonNullable<ListBoardsQuery['listBoards']>[number];

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBoards = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      
      const result = await client.graphql({
        query: listBoards,
      });

      if (result.data?.listBoards) {
        // Sort boards by createdAt (oldest first, newest last)
        const sortedBoards = [...result.data.listBoards].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setBoards(sortedBoards);
      }
    } catch (err) {
      console.error('Error fetching boards:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch boards'));
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const refetch = (silent = false) => {
    fetchBoards(silent);
  };

  const addBoardOptimistically = (board: Board) => {
    setBoards(prev => [...prev, board]);
  };

  return { boards, loading, error, refetch, addBoardOptimistically };
}
