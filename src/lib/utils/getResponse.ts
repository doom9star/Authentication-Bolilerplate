export type TResponseStatus = "SUCCESS" | "ERROR";

export type TResponse = {
  status: TResponseStatus;
  message: string;
  data?: any;
};

export default (
  status: TResponseStatus,
  message: string,
  data?: any
): TResponse => {
  return {
    status,
    message,
    data,
  };
};
