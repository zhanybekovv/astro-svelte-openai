import { describe, it, expect, vi, beforeEach } from 'vitest';
import  prismaMock from '../__mocks__/prisma'
import { createTask, getTasks, deleteTask, updateTask } from '../api';

vi.mock("../prisma");


describe('server actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTask', () => {
    it('creates a new task', async () => {
      const input = {
        title: 'Test',
        description: 'Desc',
        priority: 'low',
        dueDate: new Date(),
        completed: false
      };
      prismaMock.task.create.mockResolvedValue({ ...input, id: 1 });
      const newTask = await createTask(input, prismaMock);
      expect(prismaMock.task.create).toHaveBeenCalled();
      expect(newTask).toStrictEqual({ ...input, id: 1 })

    });
  });

  describe('getTasks', () => {
    it('returns an array of tasks', async () => {
      const tasks = [{ id: 1,  title: 'Test',
        description: 'Desc',
        priority: 'low',
        dueDate: new Date(),
        completed: false }];
      prismaMock.task.findMany.mockResolvedValue(tasks);

      const result = await getTasks(prismaMock);

      expect(prismaMock.task.findMany).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe('updateTask', () => {
    it('updates an existing task', async () => {
      const input = {
        id: 1,
        completed: true,
        title: 'Updated',
        description: 'Updated Desc',
        priority: 'high',
        dueDate: new Date(),
      };
      prismaMock.task.update.mockResolvedValue(input);

      const result = await updateTask(input, prismaMock);

      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          completed: true,
          title: 'Updated',
          description: 'Updated Desc',
          priority: 'high',
          dueDate: input.dueDate,
        },
      });
      expect(result).toEqual(input);
    });
  })


  describe('deleteTask', () => {
    it('deletes a task and returns success', async () => {
      const input = { id: 1, completed: true,
        title: 'Updated',
        description: 'Updated Desc',
        priority: 'high',
        dueDate: new Date() };
      prismaMock.task.delete.mockResolvedValue(input);

      const result = await deleteTask({ id: 1 }, prismaMock);
      expect(prismaMock.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(input);
    });
  });
});
