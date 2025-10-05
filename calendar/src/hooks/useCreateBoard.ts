import { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createBoard } from '../graphql/mutations';
import type { CreateBoardInput } from '../graphql/API';

const client = generateClient();

export function useCreateBoard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNewBoard = async (input: CreateBoardInput) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await client.graphql({
        query: createBoard,
        variables: { input },
      });

      return result.data?.createBoard;
    } catch (err) {
      console.error('Error creating board:', err);
      setError(err instanceof Error ? err : new Error('Failed to create board'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createNewBoard, loading, error };
}
