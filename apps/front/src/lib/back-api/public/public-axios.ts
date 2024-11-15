import axios from "axios";

export const publicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_API_URL,
});
