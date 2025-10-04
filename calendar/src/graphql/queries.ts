/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getBoard = /* GraphQL */ `query GetBoard($id: ID!) {
  getBoard(id: $id) {
    id
    title
    userId
    tasks {
      id
      title
      boardId
      groupId
      dueDate
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetBoardQueryVariables, APITypes.GetBoardQuery>;
export const listBoards = /* GraphQL */ `query ListBoards {
  listBoards {
    id
    title
    userId
    tasks {
      id
      title
      boardId
      groupId
      dueDate
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBoardsQueryVariables,
  APITypes.ListBoardsQuery
>;
export const getTask = /* GraphQL */ `query GetTask($id: ID!) {
  getTask(id: $id) {
    id
    title
    boardId
    groupId
    group {
      id
      name
      color
      userId
      createdAt
      updatedAt
      __typename
    }
    dueDate
    subtasks {
      id
      title
      taskId
      dueDate
      completed
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTaskQueryVariables, APITypes.GetTaskQuery>;
export const listTasksByBoard = /* GraphQL */ `query ListTasksByBoard($boardId: String!) {
  listTasksByBoard(boardId: $boardId) {
    id
    title
    boardId
    groupId
    group {
      id
      name
      color
      userId
      createdAt
      updatedAt
      __typename
    }
    dueDate
    subtasks {
      id
      title
      taskId
      dueDate
      completed
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTasksByBoardQueryVariables,
  APITypes.ListTasksByBoardQuery
>;
export const getGroup = /* GraphQL */ `query GetGroup($id: ID!) {
  getGroup(id: $id) {
    id
    name
    color
    userId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetGroupQueryVariables, APITypes.GetGroupQuery>;
export const listGroups = /* GraphQL */ `query ListGroups {
  listGroups {
    id
    name
    color
    userId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGroupsQueryVariables,
  APITypes.ListGroupsQuery
>;
