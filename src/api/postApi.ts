import { authServiceClient } from 'config';
import { AxiosResponse } from 'axios';

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const postAPI = {
  getPosts() {
    return authServiceClient.get<IPost[], AxiosResponse<IPost[]>>('/posts');
  },
};
