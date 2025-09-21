export class NoLogError extends Error {
  log: string;
  constructor(err: string | undefined) {
    super(err);
    this.log = "nolog";
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
