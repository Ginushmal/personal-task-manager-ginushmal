// Define TypeScript types
export type ApiResponse<T> =
  | SuccessResponse<T>
  | SuccessPageResponse<T>
  | ErrorResponse;

export type SuccessResponse<T> = {
  status: 200;
  message: string;
  data: T;
  timestamp: string;
};

export type SuccessPageResponse<T> = {
  status: 200;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  timestamp: string;
};

export type ErrorResponse = {
  status: number;
  error: string;
  message: string;
  code?: string;
  details?: any;
  path?: string;
  timestamp: string;
};
