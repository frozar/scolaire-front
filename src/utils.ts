export function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !("nodeType" in e)) {
    throw new Error(`Node expected`);
  }
}
