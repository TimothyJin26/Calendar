import { Amplify } from 'aws-amplify';

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_8nbG9qs3d',
      userPoolClientId: '7qahjtg56lcv5steojtb45a6fv',
      region: 'us-west-2',
    },
  },
   API: {
    GraphQL: {
      endpoint: 'https://iwldj7p5ajasvkcdhxr2nipl5y.appsync-api.us-west-2.amazonaws.com/graphql',
      region: 'us-west-2',
      defaultAuthMode: 'userPool' as const,
    }
  }
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;