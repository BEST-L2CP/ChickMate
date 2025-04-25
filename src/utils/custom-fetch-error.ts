export class FetchError extends Error {
  status: number;
  constructor(message: string, status: number, name?: string) {
    super(message);
    this.name = name || 'FetchError';
    this.status = status;
  }
}
