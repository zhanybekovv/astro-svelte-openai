const createTask = (input: any, prisma: any) => 
  prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: new Date(input.dueDate),
      completed: false,
    },
  });

const getTasks = (prisma: any) => prisma.task.findMany()

const updateTask = (input:any, prisma: any) => prisma.task.update({
  where: { id: input.id },
  data: {
    completed: input.completed,
    title: input.title,
    description: input.description,
    priority: input.priority,
    dueDate: input.dueDate && new Date(input.dueDate),
  },
})
const deleteTask = (input:any, prisma: any) => prisma.task.delete({
  where: { id: input.id },
})

export { createTask, getTasks, updateTask, deleteTask };