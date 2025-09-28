import type { TaskBlock } from '../types'

// Mock data - this would normally come from your backend
const mockTaskBlocks: TaskBlock[] = [
  {
    id: '1',
    title: 'Assignment 3',
    timeLeft: '1 week',
    dueDate: 'Sep 29',
    group: 'CPSC 320',
    groupColor: '#EEFFE7',
    tasks: [
      { id: '1a', text: 'Dynamic programming solution', timeLeft: '2 days', completed: false },
      { id: '1b', text: 'Complexity analysis', timeLeft: '1 day', completed: true }
    ]
  },
  {
    id: '2',
    title: 'Midterm Prep',
    timeLeft: '3 days',
    dueDate: 'Oct 2',
    group: 'MATH 221',
    groupColor: '#FFF0E6',
    tasks: [
      { id: '2a', text: 'Review integration techniques', timeLeft: '1 day', completed: false },
      { id: '2b', text: 'Practice problems', timeLeft: '2 days', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Essay',
    timeLeft: '2 weeks',
    dueDate: 'Oct 10',
    group: 'ENGL 110',
    groupColor: '#E6F3FF',
    tasks: [
      { id: '3a', text: 'Research and outline', timeLeft: '3 days', completed: true },
      { id: '3b', text: 'First draft', timeLeft: '4 days', completed: false }
    ]
  },
  {
    id: '4',
    title: 'Lab Report 2',
    timeLeft: '5 days',
    dueDate: 'Oct 5',
    group: 'CHEM 121',
    groupColor: '#FFE6F3',
    tasks: [
      { id: '4a', text: 'Data analysis', timeLeft: '2 days', completed: false },
      { id: '4b', text: 'Results section', timeLeft: '1 day', completed: false },
      { id: '4c', text: 'Conclusion', timeLeft: '1 day', completed: false }
    ]
  },
  {
    id: '5',
    title: 'Final Project Proposal',
    timeLeft: '1 week',
    dueDate: 'Oct 8',
    group: 'STAT 200',
    groupColor: '#F0E6FF',
    tasks: [
      { id: '5a', text: 'Choose dataset', timeLeft: '2 days', completed: true },
      { id: '5b', text: 'Literature review', timeLeft: '3 days', completed: false },
      { id: '5c', text: 'Write proposal', timeLeft: '2 days', completed: false }
    ]
  },
  {
    id: '6',
    title: 'Quiz 3 Study',
    timeLeft: '2 days',
    dueDate: 'Sep 30',
    group: 'PHYS 118',
    groupColor: '#E6FFE6',
    tasks: [
      { id: '6a', text: 'Review chapters 5-7', timeLeft: '1 day', completed: false },
      { id: '6b', text: 'Practice problems', timeLeft: '4 hours', completed: false }
    ]
  }
]

export class TaskBlockService {
  // Simulate API delay
  private static delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get all task blocks
  static async getTaskBlocks(): Promise<TaskBlock[]> {
    await this.delay()
    return [...mockTaskBlocks]
  }

  // Update task completion status
  static async updateTaskCompletion(
    blockId: string,
    taskId: string,
    completed: boolean
  ): Promise<TaskBlock[]> {
    await this.delay()
    
    const blockIndex = mockTaskBlocks.findIndex(block => block.id === blockId)
    if (blockIndex === -1) throw new Error('Task block not found')
    
    const taskIndex = mockTaskBlocks[blockIndex].tasks.findIndex(task => task.id === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    
    mockTaskBlocks[blockIndex].tasks[taskIndex].completed = completed
    return [...mockTaskBlocks]
  }

  // Create a new task block
  static async createTaskBlock(taskBlock: Omit<TaskBlock, 'id'>): Promise<TaskBlock[]> {
    await this.delay()
    
    const newTaskBlock: TaskBlock = {
      ...taskBlock,
      id: `tb_${Date.now()}`
    }
    
    mockTaskBlocks.push(newTaskBlock)
    return [...mockTaskBlocks]
  }
}