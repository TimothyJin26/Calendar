import { Amplify } from 'aws-amplify';

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_CqszfhOf3',
      userPoolClientId: '2isdpcl4h8t283mgkhj346bd6o',
      region: 'us-west-2',
    },
  },
   API: {
    GraphQL: {
      endpoint: 'https://e7243yy6mnhnhcperhvnazplgu.appsync-api.us-west-2.amazonaws.com/graphql',
      region: 'us-west-2',
      defaultAuthMode: 'userPool' as const,
    }
  }
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;