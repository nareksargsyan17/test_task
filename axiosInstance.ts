import { AxiosRequestConfig } from "axios";

export const headersRequest = (token: string): AxiosRequestConfig => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
});