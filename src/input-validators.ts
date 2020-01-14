export function validateID(v: string): string | false {
  if (/[A-Z0-9_]+/.test(v)) {
    return false;
  }

  if (v.length == 0) {
    return "Must enter a value";
  }

  return "Only capital letters, numbers and underscore are allowed";
}
