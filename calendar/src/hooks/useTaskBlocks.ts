import { useState, useEffect } from 'react'
import type { TaskBlock } from '../types'
import { TaskBlockService } from '../services/taskBlockService'

export const useTaskBlocks = () => {
  const [taskBlocks, setTaskBlocks] = useState<TaskBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load task blocks on mount
  useEffect(() => {
    const loadTaskBlocks = async () => {
      try {
        setLoading(true)
        setError(null)
        const blocks = await TaskBlockService.getTaskBlocks()
        setTaskBlocks(blocks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load task blocks')
      } finally {
        setLoading(false)
      }
    }

    loadTaskBlocks()
  }, [])

  // Handle task completion toggle
  const handleTaskToggle = async (blockId: string, taskId: string) => {
    try {
      // Find current task to get its completion status
      const currentBlock = taskBlocks.find(block => block.id === blockId)
      const currentTask = currentBlock?.tasks.find(task => task.id === taskId)
      
      if (!currentTask) return

      // Optimistically update UI
      const newCompleted = !currentTask.completed
      setTaskBlocks(prevBlocks =>
        prevBlocks.map(block =>
          block.id === blockId
            ? {
                ...block,
                tasks: block.tasks.map(task =>
                  task.id === taskId
                    ? { ...task, completed: newCompleted }
                    : task
                )
              }
            : block
        )
      )

      // Update via API
      await TaskBlockService.updateTaskCompletion(blockId, taskId, newCompleted)
    } catch (err) {
      // Revert optimistic update on error
      const blocks = await TaskBlockService.getTaskBlocks()
      setTaskBlocks(blocks)
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  return {
    taskBlocks,
    loading,
    error,
    handleTaskToggle
  }
}