'use client';

import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import { ClientSideSuspense, LiveblocksProvider } from '@liveblocks/react/suspense';
import { ReactNode, useEffect, useState } from 'react';

const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && clerkUser?.emailAddresses?.[0]?.emailAddress) {
      setUserEmail(clerkUser.emailAddresses[0].emailAddress);
    }
  }, [isLoaded, clerkUser]);

  return (
    <LiveblocksProvider 
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        try {
          const response = await fetch('/api/get-clerk-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userIds }),
          });
          if (!response.ok) throw new Error('Failed to fetch users');
          return await response.json();
        } catch (error) {
          console.error('Error fetching users:', error);
          return [];
        }
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        try {
          if (!userEmail) return [];
          const response = await fetch('/api/get-document-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId, currentUser: userEmail, text }),
          });
          if (!response.ok) throw new Error('Failed to fetch document users');
          return await response.json();
        } catch (error) {
          console.error('Error fetching document users:', error);
          return [];
        }
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
