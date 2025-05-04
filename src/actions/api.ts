
import type { Task } from "../interfaces/task";

const createTask = (input: Omit<Task, 'id' >, prisma: any) => 
  prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: new Date(input.dueDate),
      completed: input.completed,
    },
  });

const getTasks = (prisma: any) => prisma.task.findMany()

const updateTask = (input: Task, prisma: any) => prisma.task.update({
  where: { id: input.id },
  data: {
    completed: input.completed,
    title: input.title,
    description: input.description,
    priority: input.priority,
    dueDate: input.dueDate && new Date(input.dueDate),
  },
})
const deleteTask = (input: Pick<Task, 'id'>, prisma: any) => prisma.task.delete({
  where: { id: input.id },
})

export { createTask, getTasks, updateTask, deleteTask };