import { ResponseData } from "@/types/api";

export const successResponse = <T>(data: T): ResponseData<T> => ({
  success: true,
  data,
});

export const errorResponse = (error: string): ResponseData<never> => ({
  success: false,
  error,
});
