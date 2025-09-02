'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, signOut, isTrialActive } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push('/auth');
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm py-4 px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Document Processor</h1>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <div className="mr-4">
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.isSubscribed ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Premium
                  </span>
                ) : user.trialEndDate ? (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Trial {isTrialActive() ? 'Active' : 'Expired'}
                  </span>
                ) : null}
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}