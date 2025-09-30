import { Amplify } from 'aws-amplify';

// Auth configuration with actual deployed values
export const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_msSOl0VaL', // From your deployed User Pool
      userPoolClientId: '2iemjvsp4rlmru2oi1e2rtqlvi', // From your deployed User Pool Client
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        given_name: {
          required: true,
        },
        family_name: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: false,
      },
    },
  },
};

// Configure Amplify
Amplify.configure(authConfig);

export default authConfig;