class ApiError extends Error {
  statusCode: number;
  data: any;
  error: string[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    error: string[] = []
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.error = error;
  }
}

export { ApiError };