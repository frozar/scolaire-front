import hash from "object-hash";

class ObjectMap<K extends object, V> extends Map<K, V> {
  constructor() {
    super();
  }

  set(key: K, value: V) {
    let hashedKey: any = hash(key);
    super.set(hashedKey, value);
    return this;
  }

  get(key: K): V | undefined {
    let hashedKey: any = hash(key);
    return super.get(hashedKey);
  }

  has(key: K): boolean {
    let hashedKey: any = hash(key);
    return super.has(hashedKey);
  }

  delete(key: K): boolean {
    let hashedKey: any = hash(key);
    return super.delete(hashedKey);
  }
}

export const linkMap = new ObjectMap<object, L.Circle>();
