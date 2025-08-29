export class NoLogError extends Error {
  constructor(err: string | undefined) {
    super(err);
  }
}

export class HTTPError extends Error {
  code: number;
  data?: any;
  constructor(err: string | undefined, code: number, data?: any) {
    super(err);
    this.code = code;
    this.data = data;
  }
}
