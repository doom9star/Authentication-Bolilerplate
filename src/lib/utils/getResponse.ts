const responses: Record<number, string> = {
  200: "Request Successfull!",
  201: "Resource Created!",
  401: "Request Unauthorized!",
  404: "Resource Not Found!",
  500: "Internal Server Error!",
  400: "Request Refused!",
};

export default function getResponse(status: number, data?: any) {
  return {
    status: status,
    message: responses[status],
    body: data,
  };
}
