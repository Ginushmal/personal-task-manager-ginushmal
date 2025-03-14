export function successResponse({
  data,
  message = "Request successful",
}: {
  data: any;
  message?: string;
}) {
  return {
    status: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function successPageResponse({
  data,
  message = "Request successful",
  total,
  page,
  perPage,
  totalPages,
}: {
  data: any;
  message?: string;
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}) {
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
}) {
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
