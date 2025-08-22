export class NoLogError extends Error {
  constructor(err: string | undefined) {
    super(err);
  }
}

export class HTTPError extends Error {
  code: number;
  constructor(err: string | undefined, code: number) {
    super(err);
    this.code = code;
  }
}
