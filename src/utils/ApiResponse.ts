class ApiResponse {
  statusCode: number;
  data: any;
  message: string;

  constructor(
    statusCode: number,
    data: any = null,
    message: string = "Success"
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export { ApiResponse };