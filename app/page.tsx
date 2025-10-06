'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to index.html
    window.location.href = '/index.html';
  }, []);

  return <div>Redirecting...</div>;
}
