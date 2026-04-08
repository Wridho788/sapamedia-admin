'use client';

import { useEffect, useState } from 'react';
import { getPosts, type PostItem } from '@/services/post.service';

export function usePosts() {
  const [data, setData] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let canceled = false;

    getPosts()
      .then((rows) => {
        if (!canceled) {
          setData(rows);
        }
      })
      .catch(() => {
        if (!canceled) {
          setError('Failed to load posts');
        }
      })
      .finally(() => {
        if (!canceled) {
          setLoading(false);
        }
      });

    return () => {
      canceled = true;
    };
  }, []);

  return { data, loading, error };
}
