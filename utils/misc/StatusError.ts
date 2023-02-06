export class StatusError extends Error {
  status: number;

  constructor(status: number, message: string) {
    // 'Error' breaks prototype chain here
    super(message);

    this.status = status;

    // restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      if (Object.getPrototypeOf(this)) {
        Object.setPrototypeOf(this, actualProto);
      }
    }
  }
}
