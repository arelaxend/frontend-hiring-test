# [aircall.io](https://aircall.io) - Frontend technical test

This test is a part of the hiring process at Aircall for frontend positions. More information about the test  [here](https://github.com/aircall/frontend-test-react).

[![CircleCI](https://circleci.com/gh/arelaxend/frontend-hiring-test.svg?style=svg)](https://circleci.com/gh/arelaxend/frontend-hiring-test)

## Summary

The goal of this test was to make a ReactJS application displaying information about calls.

The app has two different components:
- **Activity Feed** - simple list of calls
- **Activity Detail** - detail of a call

![Activity Details](/public/frontend-test-A.jpg) ![Activity Feed](/public/frontend-test-B.jpg)
## Installation

We're using [yarn](https://yarnpkg.com) here:

```
yarn install
yarn start
```

The app is now running on [localhost:3000](http://localhost:3000).

## Run tests

We're using [react-script](https://create-react-app.dev/docs/running-tests/). Some of the components and views have been tested. To run the tests:

```
yarn test
```

To run the tests and collect code coverage information:

```
yarn run testCoverage
```

The storybook stand alone app is now running on [localhost:9001](http://localhost:9001).

## Deployment: Automatic Setup

## Deployment: Manual Setup
We have been deploying this React app to AWS with S3, Cloudfront, and Cloud Development Kit (CDK) and CircleCI.
If you want to know more about this process, please feel free to check [this blog post](https://www.xerris.com/insights/deploying-your-react-app-to-aws-in-20-minutes-with-s3-cloudfront-and-cloud-development-kit-cdk-and-circleci/)
- All the AWS infrastructure required to host your project
- An S3 Bucket for the compiled project source files
- A CloudFront Distribution (CDN) that will make your application more easily accessible
- A automated CircleCI pipeline connected to the GitHub Repo that automatically can deploy the app

### Build root folder
We need to build our React application. We would run `yarn build` in the `root` folder of the project. Once this completes you should have a build folder in the project.
### Build infrastructure
We need to build our `infrastructure` stack Typescript files so we can run them. Inside of the `infrastruture` folder we would run `yarn build`. This will create Javascript versions of our typescript files.
### deploy infrastructure
Finally we need to deploy our application, this simply requires running `yarn deploy` inside of the `infrastruture` folder to deploy your app.

Visit the application [here on cloudfront](https://d3vmd4ooj7kd4q.cloudfront.net/)

## API documentation
### GraphQL Model

Call Model

```
type Call {
  id: ID! // "unique ID of call"
  direction: String! // "inbound" or "outbound" call
  from: String! // Caller's number
  to: String! // Callee's number
  duration: Float! // Duration of a call (in seconds)
  is_archived: Boolean! // Boolean that indicates if the call is archived or not
  call_type: String! // The type of the call, it can be a missed, answered or voicemail.
  via: String! // Aircall number used for the call.
  created_at: String! // When the call has been made.
  notes: Note[]! // Notes related to a given call
}
```

Note Model

```
type Note {
  id: ID!
  content: String!
}
```

### GraphQL API

Base URL: https://frontend-test-api.aircall.io/graphql
#### Queries

`paginatedCalls` returns a list of paginated calls.

```
paginatedCalls(
  offset: Float = 0
  limit: Float = 10
): PaginatedCalls!

type PaginatedCalls {
  nodes: [Call!]
  totalCount: Int!
  hasNextPage: Boolean!
}
```

`call` returns a single call if any, otherwise it returns null.

```
call(id: Float!): Call
```
#### Mutations

To be able to grab a valid JWT token, you need to execute the `login` mutation.

`login` receives the username and password as 1st parameter and return the access_token and the user identity.

```graphql
login(input: LoginInput!): AuthResponseType!

input LoginInput {
  username: String!
  password: String!
}

interface AuthResponseType {
  access_token: String!
  user: UserType
}
```

Once you are correctly authenticated you need to pass the Authorization header for all the next calls to the GraphQL API.

```JSON
{
  "Authorization": "Bearer <YOUR_ACCESS_TOKEN>"
}
```

Note that the access_token is only available for 10 minutes. You need to ask for another fresh token by calling the `refreshToken` mutation before the token gets expired.

`refreshToken` allows you to ask for a new fresh token based on your existing access_token

```graphql
refreshToken: AuthResponseType!
```

`archiveCall` as the name implies it either archive or unarchive a given call.If the call doesn't exist, it'll throw an error.

```
archiveCall(id: ID!): Call!
```

`addNote` create a note and add it prepend it to the call's notes list.

```
addNote(input: AddNoteInput!): Call!

input AddNoteInput {
  activityId: ID!
  content: String!
}
```

## What's next ?
- Setup a style guide to build a stand alone components documentation app.
- implement subscriptions instead of getting the data from the queries or mutations responses.
- use the `refreshToken` mutation instead of using SWR auto-refresh.