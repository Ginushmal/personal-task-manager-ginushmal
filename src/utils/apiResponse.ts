import {
  ErrorResponse,
  SuccessPageResponse,
  SuccessResponse,
} from "@/types/apiRespons";

// Functions using the types
export function successResponse<T>({
  data,
  message = "Request successful",
}: {
  data: T;
  message?: string;
}): SuccessResponse<T> {
  return {
    status: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function successPageResponse<T>({
  data,
  message = "Request successful",
  total,
  page,
  perPage,
  totalPages,
}: {
  data: T[];
  message?: string;
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}): SuccessPageResponse<T> {
  return {
    status: 200,
    message,
    data,
    meta: {
      total,
      page,
      perPage,
      totalPages,
    },
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse({
  status,
  error,
  message,
  code = "UNKNOWN_ERROR",
  details,
  path,
}: {
  status: number;
  error: string;
  message: string;
  code?: string;
  details?: any;
  path?: string;
}): ErrorResponse {
  return {
    status,
    error,
    message,
    code,
    details,
    timestamp: new Date().toISOString(),
    path,
  };
}
