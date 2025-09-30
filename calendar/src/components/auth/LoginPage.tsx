import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your Calendar
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your tasks and notebooks
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <Authenticator 
            signUpAttributes={['email', 'given_name', 'family_name']}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;