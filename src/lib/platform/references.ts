import { randomInt } from "node:crypto";

type ReferenceExists = (reference: string) => Promise<boolean>;

export async function createUniqueReference(prefix: string, exists: ReferenceExists) {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const reference = `${prefix}-${year}-${randomInt(100000, 999999)}`;

    if (!(await exists(reference))) {
      return reference;
    }
  }

  throw new Error(`Unable to create a unique ${prefix} reference.`);
}
