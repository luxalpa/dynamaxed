export function validateID(v: string): string | false {
  if (/[A-Z0-9_]+/.test(v)) {
    return false;
  }

  if (v.length == 0) {
    return "Must enter a value";
  }

  return "Only capital letters, numbers and underscore are allowed";
}

export function createTextValidator(maxlen?: number) {
  return function(v: string) {
    if (maxlen !== undefined && v.length > maxlen) {
      return `Must be at max ${maxlen} characters`;
    }
    return false;
  };
}
