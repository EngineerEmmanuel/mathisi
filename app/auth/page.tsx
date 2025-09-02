'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInForm, SignUpForm } from '../components/AuthForms';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Document Processor
        </h1>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSignUp ? <SignUpForm /> : <SignInForm />}
          
          <div className="mt-6">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}