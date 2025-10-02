import { Amplify } from 'aws-amplify';

// Auth configuration with actual deployed values
export const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_8nbG9qs3d',
      userPoolClientId: '7qahjtg56lcv5steojtb45a6fv',
      region: 'us-west-2',
    },
  },
};

// Configure Amplify
Amplify.configure(authConfig);

export default authConfig;