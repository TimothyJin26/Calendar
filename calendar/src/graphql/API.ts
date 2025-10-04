/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateBoardInput = {
  title: string,
};

export type Board = {
  __typename: "Board",
  id: string,
  title: string,
  userId: string,
  tasks:  Array<Task >,
  createdAt: string,
  updatedAt: string,
};

export type Task = {
  __typename: "Task",
  id: string,
  title: string,
  boardId: string,
  groupId?: string | null,
  group?: Group | null,
  dueDate?: string | null,
  subtasks:  Array<Subtask >,
  createdAt: string,
  updatedAt: string,
};

export type Group = {
  __typename: "Group",
  id: string,
  name: string,
  color?: string | null,
  userId: string,
  createdAt: string,
  updatedAt: string,
};

export type Subtask = {
  __typename: "Subtask",
  id: string,
  title: string,
  taskId: string,
  dueDate?: string | null,
  completed: boolean,
  createdAt: string,
  updatedAt: string,
};

export type UpdateBoardInput = {
  id: string,
  title?: string | null,
};

export type CreateTaskInput = {
  title: string,
  boardId: string,
  groupId?: string | null,
  dueDate?: string | null,
};

export type UpdateTaskInput = {
  id: string,
  title?: string | null,
  groupId?: string | null,
  dueDate?: string | null,
};

export type CreateSubtaskInput = {
  title: string,
  taskId: string,
  dueDate?: string | null,
};

export type UpdateSubtaskInput = {
  id: string,
  title?: string | null,
  dueDate?: string | null,
  completed?: boolean | null,
};

export type CreateGroupInput = {
  name: string,
  color?: string | null,
};

export type UpdateGroupInput = {
  id: string,
  name?: string | null,
  color?: string | null,
};

export type CreateBoardMutationVariables = {
  input: CreateBoardInput,
};

export type CreateBoardMutation = {
  // Board mutations
  createBoard:  {
    __typename: "Board",
    id: string,
    title: string,
    userId: string,
    tasks:  Array< {
      __typename: "Task",
      id: string,
      title: string,
      boardId: string,
      groupId?: string | null,
      dueDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } >,
    createdAt: string,
    updatedAt: string,
  },
};

export type UpdateBoardMutationVariables = {
  input: UpdateBoardInput,
};

export type UpdateBoardMutation = {
  updateBoard:  {
    __typename: "Board",
    id: string,
    title: string,
    userId: string,
    tasks:  Array< {
      __typename: "Task",
      id: string,
      title: string,
      boardId: string,
      groupId?: string | null,
      dueDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } >,
    createdAt: string,
    updatedAt: string,
  },
};

export type DeleteBoardMutationVariables = {
  id: string,
};

export type DeleteBoardMutation = {
  deleteBoard: boolean,
};

export type CreateTaskMutationVariables = {
  input: CreateTaskInput,
};

export type CreateTaskMutation = {
  // Task mutations
  createTask:  {
    __typename: "Task",
    id: string,
    title: string,
    boardId: string,
    groupId?: string | null,
    group?:  {
      __typename: "Group",
      id: string,
      name: string,
      color?: string | null,
      userId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dueDate?: string | null,
    subtasks:  Array< {
      __typename: "Subtask",
      id: string,
      title: string,
      taskId: string,
      dueDate?: string | null,
      completed: boolean,
      createdAt: string,
      updatedAt: string,
    } >,
    createdAt: string,
    updatedAt: string,
  },
};

export type UpdateTaskMutationVariables = {
  input: UpdateTaskInput,
};

export type UpdateTaskMutation = {
  updateTask:  {
    __typename: "Task",
    id: string,
    title: string,
    boardId: string,
    groupId?: string | null,
    group?:  {
      __typename: "Group",
      id: string,
      name: string,
      color?: string | null,
      userId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dueDate?: string | null,
    subtasks:  Array< {
      __typename: "Subtask",
      id: string,
      title: string,
      taskId: string,
      dueDate?: string | null,
      completed: boolean,
      createdAt: string,
      updatedAt: string,
    } >,
    createdAt: string,
    updatedAt: string,
  },
};

export type DeleteTaskMutationVariables = {
  id: string,
};

export type DeleteTaskMutation = {
  deleteTask: boolean,
};

export type CreateSubtaskMutationVariables = {
  input: CreateSubtaskInput,
};

export type CreateSubtaskMutation = {
  // Subtask mutations
  createSubtask:  {
    __typename: "Subtask",
    id: string,
    title: string,
    taskId: string,
    dueDate?: string | null,
    completed: boolean,
    createdAt: string,
    updatedAt: string,
  },
};

export type UpdateSubtaskMutationVariables = {
  input: UpdateSubtaskInput,
};

export type UpdateSubtaskMutation = {
  updateSubtask:  {
    __typename: "Subtask",
    id: string,
    title: string,
    taskId: string,
    dueDate?: string | null,
    completed: boolean,
    createdAt: string,
    updatedAt: string,
  },
};

export type DeleteSubtaskMutationVariables = {
  id: string,
};

export type DeleteSubtaskMutation = {
  deleteSubtask: boolean,
};

export type CreateGroupMutationVariables = {
  input: CreateGroupInput,
};

export type CreateGroupMutation = {
  // Group mutations
  createGroup:  {
    __typename: "Group",
    id: string,
    name: string,
    color?: string | null,
    userId: string,
    createdAt: string,
    updatedAt: string,
  },
};

export type UpdateGroupMutationVariables = {
  input: UpdateGroupInput,
};

export type UpdateGroupMutation = {
  updateGroup:  {
    __typename: "Group",
    id: string,
    name: string,
    color?: string | null,
    userId: string,
    createdAt: string,
    updatedAt: string,
  },
};

export type DeleteGroupMutationVariables = {
  id: string,
};

export type DeleteGroupMutation = {
  deleteGroup: boolean,
};

export type GetBoardQueryVariables = {
  id: string,
};

export type GetBoardQuery = {
  // Board queries
  getBoard?:  {
    __typename: "Board",
    id: string,
    title: string,
    userId: string,
    tasks:  Array< {
      __typename: "Task",
      id: string,
      title: string,
      boardId: string,
      groupId?: string | null,
      dueDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListBoardsQueryVariables = {
};

export type ListBoardsQuery = {
  listBoards:  Array< {
    __typename: "Board",
    id: string,
    title: string,
    userId: string,
    tasks:  Array< {
      __typename: "Task",
      id: string,
      title: string,
      boardId: string,
      groupId?: string | null,
      dueDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } >,
};

export type GetTaskQueryVariables = {
  id: string,
};

export type GetTaskQuery = {
  // Task queries
  getTask?:  {
    __typename: "Task",
    id: string,
    title: string,
    boardId: string,
    groupId?: string | null,
    group?:  {
      __typename: "Group",
      id: string,
      name: string,
      color?: string | null,
      userId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dueDate?: string | null,
    subtasks:  Array< {
      __typename: "Subtask",
      id: string,
      title: string,
      taskId: string,
      dueDate?: string | null,
      completed: boolean,
      createdAt: string,
      updatedAt: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTasksByBoardQueryVariables = {
  boardId: string,
};

export type ListTasksByBoardQuery = {
  listTasksByBoard:  Array< {
    __typename: "Task",
    id: string,
    title: string,
    boardId: string,
    groupId?: string | null,
    group?:  {
      __typename: "Group",
      id: string,
      name: string,
      color?: string | null,
      userId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dueDate?: string | null,
    subtasks:  Array< {
      __typename: "Subtask",
      id: string,
      title: string,
      taskId: string,
      dueDate?: string | null,
      completed: boolean,
      createdAt: string,
      updatedAt: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } >,
};

export type GetGroupQueryVariables = {
  id: string,
};

export type GetGroupQuery = {
  // Group queries
  getGroup?:  {
    __typename: "Group",
    id: string,
    name: string,
    color?: string | null,
    userId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGroupsQueryVariables = {
};

export type ListGroupsQuery = {
  listGroups:  Array< {
    __typename: "Group",
    id: string,
    name: string,
    color?: string | null,
    userId: string,
    createdAt: string,
    updatedAt: string,
  } >,
};
