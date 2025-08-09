export type ResponseData<T> =
  | { success: true; data: T }
  | { success: false; error: string };
