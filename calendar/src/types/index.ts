export interface Task {
  id: string
  text: string
  timeLeft: string
  completed: boolean
}

export interface TaskBlock {
  id: string
  title: string
  timeLeft: string
  dueDate: string
  group: string
  groupColor: string
  tasks: Task[]
}