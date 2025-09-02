'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface PaymentWallProps {
  children: React.ReactNode;
}

export default function PaymentWall({ children }: PaymentWallProps) {
  const { user, isTrialActive } = useAuth();
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);

  useEffect(() => {
    // Load Lemon.js script
    const script = document.createElement('script');
    script.src = 'https://app.lemonsqueezy.com/js/lemon.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check if user has access
  const hasAccess = user && (isTrialActive() || user.isSubscribed);

  const openCheckout = () => {
    // Replace with your actual Lemon Squeezy checkout URL
    const checkoutUrl = 'https://demo.lemonsqueezy.com/checkout';
    
    // @ts-ignore - Lemon.js adds this to the window object
    if (window.createLemonSqueezy) {
      // @ts-ignore
      window.createLemonSqueezy();
      // @ts-ignore
      window.LemonSqueezy.Url.Open(checkoutUrl);
    } else {
      // Fallback if script isn't loaded
      window.open(checkoutUrl, '_blank');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Trial Has Expired</h2>
          
          <p className="mb-6 text-gray-600">
            Your 7-day free trial has ended. Subscribe now to continue using all features of our document processing tool.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-2">Premium Features:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generate quizzes from any document</li>
              <li>Create comprehensive summaries</li>
              <li>Visualize content with mind maps</li>
              <li>Unlimited document processing</li>
            </ul>
          </div>
          
          <button
            onClick={openCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            Subscribe Now
          </button>
          
          <p className="mt-4 text-sm text-gray-500 text-center">
            Secure payment powered by Lemon Squeezy
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}