import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { prisma } from './prisma';
import OpenAI from 'openai';
import { createTask, getTasks, deleteTask, updateTask } from './api';

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
      completed: z.boolean(),
    }),
    async handler(input) {
      try {
        return await createTask(input, prisma);
      } catch (e) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Could not create task' });
      }
    },
  }),

  getTasks: defineAction({
    async handler() {
      return await getTasks(prisma);
    },
  }),

  generateDescription: defineAction({
    input: z.object({ title: z.string() }),
    async handler(input) {
      return await client.responses.create({
        model: 'gpt-4o',
        instructions: 'Generate a task description for the following title. Give me answer NOT more than 50 words',
        input: input.title,
      });
    }
  }),

  updateTask: defineAction({
    input: z.object({
      id: z.coerce.number(),
      completed: z.boolean(),
      title: z.string(),
      description: z.string(),
      priority: z.enum(['low','medium','high']),
      dueDate:  z.coerce.date(),
    }),
    async handler(input) {
      try {
        return await updateTask(input, prisma);
      } catch (e) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Could not update task' });
      }
    },
  }),

  deleteTask: defineAction({
    input: z.object({ id: z.coerce.number() }),
    async handler(input) {
      await deleteTask(input, prisma)
      return { success: true };
    },
  }),
};
