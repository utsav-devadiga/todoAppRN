import axios, { AxiosInstance } from 'axios';
import { encode, decode } from 'base-64';
import env from '../.env'

// Apply the polyfill
global.btoa = encode;
global.atob = decode;


const base64Encode = (str: string) => {
    return btoa(str);
};

const base64Decode = (str: string) => {
    return atob(str);
};

// Encode the authentication credentials
const AUTH_USER = env.AUTH_USER_NAME;
const AUTH_PASSWORD = env.AUTH_PASSWORD;
const authHeader = 'Basic ' + base64Encode(`${AUTH_USER}:${AUTH_PASSWORD}`);

// Create an instance of Axios with the configured base URL and default headers for basic authentication
const apiClient: AxiosInstance = axios.create({
    baseURL: env.API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader // Add the Authorization header with the encoded credentials
    }
});

export default apiClient;
