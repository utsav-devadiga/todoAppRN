import API from './ApiClient';
import { AxiosResponse } from 'axios';

export interface Todo {
    about: string;
    deadline: string;
    id: number;
    name: string;
    priority: string;
    status: number;
    statusTimestamp: string;
    userid: string;
}

interface TodoResponse {
    lastUpdated: number;
    message: string;
    nextPage: null | string;
    prevPage: null | string;
    success: boolean;
    todo: Todo[];
}


export const getAllTodos = async (userId: string | undefined): Promise<TodoResponse> => {
    if (!userId) {
         return {
            lastUpdated: Date.now(),
            message: "No user ID provided",
            nextPage: null,
            prevPage: null,
            success: false,
            todo: []
        };
    }
    try {
        const response = await API.get<TodoResponse>(`/alltodo?userID=${userId}`);
        //console.log("Data found for user: \n\n", response.data);
        return response.data;  // Assuming the API response matches TodoResponse exactly
    } catch (error) {
        console.error("Error fetching todos:", error);
        // Return full structure with empty list on error
        return {
            lastUpdated: Date.now(),
            message: "Failed to fetch todos",
            nextPage: null,
            prevPage: null,
            success: false,
            todo: []
        };
    }
};



export const postTodo = async (todoData: Todo): Promise<TodoResponse> => {
    try {
        const response: AxiosResponse<TodoResponse> = await API.post('/posttodo', todoData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTodo = async (todoId: number, updatedData: Partial<Todo>): Promise<TodoResponse> => {
    try {
        const response: AxiosResponse<TodoResponse> = await API.patch(`/updatetodo/${todoId}`, updatedData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTodo = async (todoId: number): Promise<TodoResponse> => {
    try {
        const response: AxiosResponse<TodoResponse> = await API.delete(`/tododelete/${todoId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
