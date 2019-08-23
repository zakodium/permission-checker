export default class InvalidPermissionSlug extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
