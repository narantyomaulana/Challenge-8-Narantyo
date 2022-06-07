class ApplicationError extends Error {
  get details() {
    return {
      name: this.name,
      message: this.message,
    };
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        details: this.details,
      },
    };
  }
}

module.exports = ApplicationError;
