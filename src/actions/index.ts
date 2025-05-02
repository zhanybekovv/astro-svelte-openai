import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export const server = {
  createTask: defineAction({
    accept: 'form',
    input: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      priority: z.enum(['low','medium','high']),
      dueDate: z.coerce.date(),
    }),
    async handler(input) {
      try {
        const task = await prisma.task.create({
          data: {
            title: input.title,
            description: input.description,
            priority: input.priority,
            dueDate: new Date(input.dueDate),
            completed: false,
          },
        });
        return task;
      } catch (e) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Could not create task' });
      }
    },
  }),

  getTasks: defineAction({
    async handler() {
      return prisma.task.findMany();
    },
  }),

  generateDescription: defineAction({
    input: z.object({ title: z.string() }),
    async handler(input) {
      return  await client.responses.create({
        model: 'gpt-4o',
        instructions: 'Generate a task description for the following title. Give me answer NOT more than 50 words',
        input: input.title,
      });
    }
  }),

  updateTask: defineAction({
    input: z.object({
      id: z.coerce.number(),
      completed: z.boolean().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      priority: z.enum(['low','medium','high']).optional(),
      dueDate:  z.coerce.date(),
    }),
    async handler(input) {
      try {
        return prisma.task.update({
          where: { id: input.id },
          data: {
            completed: input.completed,
            title: input.title,
            description: input.description,
            priority: input.priority,
            dueDate: input.dueDate && new Date(input.dueDate),
          },
        });
      } catch (e) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Could not update task' });
      }
    },
  }),

  deleteTask: defineAction({
    input: z.object({ id: z.coerce.number() }),
    async handler(input) {
      await prisma.task.delete({ where: { id: input.id } });
      return { success: true };
    },
  }),
};
