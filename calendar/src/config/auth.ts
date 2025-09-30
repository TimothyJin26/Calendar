import { Amplify } from 'aws-amplify';

// Auth configuration with actual deployed values
export const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_msSOl0VaL',
      userPoolClientId: '2iemjvsp4rlmru2oi1e2rtqlvi',
      region: 'us-west-2',
    },
  },
};

// Configure Amplify
Amplify.configure(authConfig);

export default authConfig;