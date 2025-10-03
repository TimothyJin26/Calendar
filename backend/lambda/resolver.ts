import { AppSyncResolverEvent, Context } from 'aws-lambda';
import { Client } from 'pg';

// Use runtime AWS SDK v3 - no import needed, available globally in Lambda
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const secretsManager = new SecretsManagerClient({});

interface DatabaseCredentials {
  username: string;
  password: string;
}

let dbClient: Client | null = null;

async function getDbClient(): Promise<Client> {
  if (dbClient) {
    return dbClient;
  }

  // Get database credentials from Secrets Manager
  const secretArn = process.env.DATABASE_SECRET_ARN!;
  const command = new GetSecretValueCommand({ SecretId: secretArn });
  const secretValue = await secretsManager.send(command);
  const credentials: DatabaseCredentials = JSON.parse(secretValue.SecretString!);

  dbClient = new Client({
    host: process.env.DATABASE_ENDPOINT!,
    port: parseInt(process.env.DATABASE_PORT!),
    database: process.env.DATABASE_NAME!,
    user: credentials.username,
    password: credentials.password,
    ssl: { rejectUnauthorized: false },
  });

  await dbClient.connect();
  return dbClient;
}

export const handler = async (event: AppSyncResolverEvent<any>, context: Context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const { info, arguments: args, identity } = event;
  const fieldName = info.fieldName;
  const typeName = info.parentTypeName;
  const userId = (identity as any)?.sub;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const client = await getDbClient();
    
    // Initialize database tables if they don't exist
    await initializeTables(client);

    switch (`${typeName}.${fieldName}`) {
      // Board operations
      case 'Query.listBoards':
        return await listBoards(client, userId);
      case 'Query.getBoard':
        return await getBoard(client, args.id, userId);
      case 'Mutation.createBoard':
        return await createBoard(client, args.input, userId);
      case 'Mutation.updateBoard':
        return await updateBoard(client, args.input, userId);
      case 'Mutation.deleteBoard':
        return await deleteBoard(client, args.id, userId);

      // Task operations
      case 'Query.getTask':
        return await getTask(client, args.id, userId);
      case 'Query.listTasksByBoard':
        return await listTasksByBoard(client, args.boardId, userId);
      case 'Mutation.createTask':
        return await createTask(client, args.input, userId);
      case 'Mutation.updateTask':
        return await updateTask(client, args.input, userId);
      case 'Mutation.deleteTask':
        return await deleteTask(client, args.id, userId);

      // Subtask operations
      case 'Mutation.createSubtask':
        return await createSubtask(client, args.input, userId);
      case 'Mutation.updateSubtask':
        return await updateSubtask(client, args.input, userId);
      case 'Mutation.deleteSubtask':
        return await deleteSubtask(client, args.id, userId);

      // Group operations
      case 'Query.listGroups':
        return await listGroups(client, userId);
      case 'Query.getGroup':
        return await getGroup(client, args.id, userId);
      case 'Mutation.createGroup':
        return await createGroup(client, args.input, userId);
      case 'Mutation.updateGroup':
        return await updateGroup(client, args.input, userId);
      case 'Mutation.deleteGroup':
        return await deleteGroup(client, args.id, userId);

      default:
        throw new Error(`Unknown field: ${typeName}.${fieldName}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

async function initializeTables(client: Client) {
  // Create tables if they don't exist
  await client.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    CREATE TABLE IF NOT EXISTS boards (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS groups (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      color VARCHAR(7),
      user_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
      group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
      due_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS subtasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      due_date TIMESTAMP WITH TIME ZONE,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON tasks(board_id);
    CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);
    CREATE INDEX IF NOT EXISTS idx_groups_user_id ON groups(user_id);
  `);
}

// Board functions
async function listBoards(client: Client, userId: string) {
  const result = await client.query(
    'SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(formatBoard);
}

async function getBoard(client: Client, boardId: string, userId: string) {
  const result = await client.query(
    'SELECT * FROM boards WHERE id = $1 AND user_id = $2',
    [boardId, userId]
  );
  if (result.rows.length === 0) return null;
  return formatBoard(result.rows[0]);
}

async function createBoard(client: Client, input: any, userId: string) {
  const result = await client.query(
    'INSERT INTO boards (title, user_id) VALUES ($1, $2) RETURNING *',
    [input.title, userId]
  );
  return formatBoard(result.rows[0]);
}

async function updateBoard(client: Client, input: any, userId: string) {
  const result = await client.query(
    'UPDATE boards SET title = COALESCE($1, title), updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
    [input.title, input.id, userId]
  );
  if (result.rows.length === 0) throw new Error('Board not found');
  return formatBoard(result.rows[0]);
}

async function deleteBoard(client: Client, boardId: string, userId: string) {
  const result = await client.query(
    'DELETE FROM boards WHERE id = $1 AND user_id = $2',
    [boardId, userId]
  );
  return (result.rowCount || 0) > 0;
}

// Task functions
async function listTasksByBoard(client: Client, boardId: string, userId: string) {
  const result = await client.query(`
    SELECT t.*, g.name as group_name, g.color as group_color
    FROM tasks t
    LEFT JOIN groups g ON t.group_id = g.id
    WHERE t.board_id = $1 AND EXISTS (
      SELECT 1 FROM boards b WHERE b.id = t.board_id AND b.user_id = $2
    )
    ORDER BY t.created_at DESC
  `, [boardId, userId]);
  
  return result.rows.map(formatTask);
}

async function getTask(client: Client, taskId: string, userId: string) {
  const result = await client.query(`
    SELECT t.*, g.name as group_name, g.color as group_color
    FROM tasks t
    LEFT JOIN groups g ON t.group_id = g.id
    WHERE t.id = $1 AND EXISTS (
      SELECT 1 FROM boards b WHERE b.id = t.board_id AND b.user_id = $2
    )
  `, [taskId, userId]);
  
  if (result.rows.length === 0) return null;
  return formatTask(result.rows[0]);
}

async function createTask(client: Client, input: any, userId: string) {
  // Verify board ownership
  const boardCheck = await client.query(
    'SELECT id FROM boards WHERE id = $1 AND user_id = $2',
    [input.boardId, userId]
  );
  if (boardCheck.rows.length === 0) throw new Error('Board not found');

  const result = await client.query(
    'INSERT INTO tasks (title, board_id, group_id, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
    [input.title, input.boardId, input.groupId || null, input.dueDate || null]
  );
  return formatTask(result.rows[0]);
}

async function updateTask(client: Client, input: any, userId: string) {
  const result = await client.query(`
    UPDATE tasks SET 
      title = COALESCE($1, title),
      group_id = COALESCE($2, group_id),
      due_date = COALESCE($3, due_date),
      updated_at = NOW()
    WHERE id = $4 AND EXISTS (
      SELECT 1 FROM boards b WHERE b.id = tasks.board_id AND b.user_id = $5
    )
    RETURNING *
  `, [input.title, input.groupId, input.dueDate, input.id, userId]);
  
  if (result.rows.length === 0) throw new Error('Task not found');
  return formatTask(result.rows[0]);
}

async function deleteTask(client: Client, taskId: string, userId: string) {
  const result = await client.query(`
    DELETE FROM tasks 
    WHERE id = $1 AND EXISTS (
      SELECT 1 FROM boards b WHERE b.id = tasks.board_id AND b.user_id = $2
    )
  `, [taskId, userId]);
  
  return (result.rowCount || 0) > 0;
}

// Subtask functions
async function createSubtask(client: Client, input: any, userId: string) {
  // Verify task ownership
  const taskCheck = await client.query(`
    SELECT t.id FROM tasks t
    JOIN boards b ON t.board_id = b.id
    WHERE t.id = $1 AND b.user_id = $2
  `, [input.taskId, userId]);
  
  if (taskCheck.rows.length === 0) throw new Error('Task not found');

  const result = await client.query(
    'INSERT INTO subtasks (title, task_id, due_date) VALUES ($1, $2, $3) RETURNING *',
    [input.title, input.taskId, input.dueDate || null]
  );
  return formatSubtask(result.rows[0]);
}

async function updateSubtask(client: Client, input: any, userId: string) {
  const result = await client.query(`
    UPDATE subtasks SET 
      title = COALESCE($1, title),
      due_date = COALESCE($2, due_date),
      completed = COALESCE($3, completed),
      updated_at = NOW()
    WHERE id = $4 AND EXISTS (
      SELECT 1 FROM tasks t
      JOIN boards b ON t.board_id = b.id
      WHERE t.id = subtasks.task_id AND b.user_id = $5
    )
    RETURNING *
  `, [input.title, input.dueDate, input.completed, input.id, userId]);
  
  if (result.rows.length === 0) throw new Error('Subtask not found');
  return formatSubtask(result.rows[0]);
}

async function deleteSubtask(client: Client, subtaskId: string, userId: string) {
  const result = await client.query(`
    DELETE FROM subtasks 
    WHERE id = $1 AND EXISTS (
      SELECT 1 FROM tasks t
      JOIN boards b ON t.board_id = b.id
      WHERE t.id = subtasks.task_id AND b.user_id = $2
    )
  `, [subtaskId, userId]);
  
  return (result.rowCount || 0) > 0;
}

// Group functions
async function listGroups(client: Client, userId: string) {
  const result = await client.query(
    'SELECT * FROM groups WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(formatGroup);
}

async function getGroup(client: Client, groupId: string, userId: string) {
  const result = await client.query(
    'SELECT * FROM groups WHERE id = $1 AND user_id = $2',
    [groupId, userId]
  );
  if (result.rows.length === 0) return null;
  return formatGroup(result.rows[0]);
}

async function createGroup(client: Client, input: any, userId: string) {
  const result = await client.query(
    'INSERT INTO groups (name, color, user_id) VALUES ($1, $2, $3) RETURNING *',
    [input.name, input.color || null, userId]
  );
  return formatGroup(result.rows[0]);
}

async function updateGroup(client: Client, input: any, userId: string) {
  const result = await client.query(
    'UPDATE groups SET name = COALESCE($1, name), color = COALESCE($2, color), updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
    [input.name, input.color, input.id, userId]
  );
  if (result.rows.length === 0) throw new Error('Group not found');
  return formatGroup(result.rows[0]);
}

async function deleteGroup(client: Client, groupId: string, userId: string) {
  const result = await client.query(
    'DELETE FROM groups WHERE id = $1 AND user_id = $2',
    [groupId, userId]
  );
  return (result.rowCount || 0) > 0;
}

// Formatting functions
function formatBoard(row: any) {
  return {
    id: row.id,
    title: row.title,
    userId: row.user_id,
    tasks: [], // Will be populated by AppSync resolver
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function formatTask(row: any) {
  return {
    id: row.id,
    title: row.title,
    boardId: row.board_id,
    groupId: row.group_id,
    group: row.group_id ? {
      id: row.group_id,
      name: row.group_name,
      color: row.group_color,
    } : null,
    dueDate: row.due_date?.toISOString(),
    subtasks: [], // Will be populated by AppSync resolver
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function formatSubtask(row: any) {
  return {
    id: row.id,
    title: row.title,
    taskId: row.task_id,
    dueDate: row.due_date?.toISOString(),
    completed: row.completed,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function formatGroup(row: any) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    userId: row.user_id,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}