/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createBoard = /* GraphQL */ `mutation CreateBoard($input: CreateBoardInput!) {
  createBoard(input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateBoardMutationVariables,
  APITypes.CreateBoardMutation
>;
export const updateBoard = /* GraphQL */ `mutation UpdateBoard($input: UpdateBoardInput!) {
  updateBoard(input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateBoardMutationVariables,
  APITypes.UpdateBoardMutation
>;
export const deleteBoard = /* GraphQL */ `mutation DeleteBoard($id: ID!) {
  deleteBoard(id: $id)
}
` as GeneratedMutation<
  APITypes.DeleteBoardMutationVariables,
  APITypes.DeleteBoardMutation
>;
export const createTask = /* GraphQL */ `mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTaskMutationVariables,
  APITypes.CreateTaskMutation
>;
export const updateTask = /* GraphQL */ `mutation UpdateTask($input: UpdateTaskInput!) {
  updateTask(input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTaskMutationVariables,
  APITypes.UpdateTaskMutation
>;
export const deleteTask = /* GraphQL */ `mutation DeleteTask($id: ID!) {
  deleteTask(id: $id)
}
` as GeneratedMutation<
  APITypes.DeleteTaskMutationVariables,
  APITypes.DeleteTaskMutation
>;
export const createSubtask = /* GraphQL */ `mutation CreateSubtask($input: CreateSubtaskInput!) {
  createSubtask(input: $input) {
    id
    title
    taskId
    dueDate
    completed
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSubtaskMutationVariables,
  APITypes.CreateSubtaskMutation
>;
export const updateSubtask = /* GraphQL */ `mutation UpdateSubtask($input: UpdateSubtaskInput!) {
  updateSubtask(input: $input) {
    id
    title
    taskId
    dueDate
    completed
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSubtaskMutationVariables,
  APITypes.UpdateSubtaskMutation
>;
export const deleteSubtask = /* GraphQL */ `mutation DeleteSubtask($id: ID!) {
  deleteSubtask(id: $id)
}
` as GeneratedMutation<
  APITypes.DeleteSubtaskMutationVariables,
  APITypes.DeleteSubtaskMutation
>;
export const createGroup = /* GraphQL */ `mutation CreateGroup($input: CreateGroupInput!) {
  createGroup(input: $input) {
    id
    name
    color
    userId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGroupMutationVariables,
  APITypes.CreateGroupMutation
>;
export const updateGroup = /* GraphQL */ `mutation UpdateGroup($input: UpdateGroupInput!) {
  updateGroup(input: $input) {
    id
    name
    color
    userId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGroupMutationVariables,
  APITypes.UpdateGroupMutation
>;
export const deleteGroup = /* GraphQL */ `mutation DeleteGroup($id: ID!) {
  deleteGroup(id: $id)
}
` as GeneratedMutation<
  APITypes.DeleteGroupMutationVariables,
  APITypes.DeleteGroupMutation
>;
