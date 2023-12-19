import { authServiceClient } from 'config';

export interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const todoAPI = {
  getTodos() {
    return authServiceClient.get<ITodo[]>('/todos');
  },
};
