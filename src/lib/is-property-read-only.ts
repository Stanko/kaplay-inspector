export const isPropertyReadOnly = (obj: object, property: PropertyKey) => {
  let current: object | null = obj;

  while (current) {
    const descriptor = Object.getOwnPropertyDescriptor(current, property);

    if (descriptor) {
      return "writable" in descriptor
        ? descriptor.writable === false
        : descriptor.set === undefined;
    }

    current = Object.getPrototypeOf(current);
  }

  return false;
};
