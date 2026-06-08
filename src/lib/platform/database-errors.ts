import "server-only";

const loggedConnectionScopes = new Set<string>();

type PrismaLikeError = {
  code?: string;
  name?: string;
  message?: string;
  meta?: {
    database_location?: string;
    connection_limit?: number;
    modelName?: string;
    timeout?: number;
  };
};

export function isDatabasePoolTimeoutError(error: unknown) {
  const value = error as PrismaLikeError;
  const message = value?.message ?? "";

  return (
    value?.code === "P2024" ||
    message.includes("Timed out fetching a new connection from the connection pool") ||
    message.includes("connection pool timeout")
  );
}

export function isDatabaseConnectionError(error: unknown) {
  const value = error as PrismaLikeError;
  const message = value?.message ?? "";

  return (
    value?.code === "P1001" ||
    isDatabasePoolTimeoutError(error) ||
    value?.name === "PrismaClientInitializationError" ||
    message.includes("Can't reach database server")
  );
}

export function isDatabaseSchemaMismatchError(error: unknown) {
  const value = error as PrismaLikeError;
  const message = value?.message ?? "";

  return (
    value?.code === "P2022" ||
    message.includes("The column") ||
    message.includes("does not exist in the current database")
  );
}

export function getDatabaseUnavailableMessage(error?: unknown) {
  const value = error as PrismaLikeError | undefined;
  const location = value?.meta?.database_location;

  if (isDatabasePoolTimeoutError(error)) {
    return "Ruguna could not get a database connection quickly enough. Please wait a moment and try again.";
  }

  return location
    ? `Ruguna could not reach the database at ${location}.`
    : "Ruguna could not reach the database.";
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function withDatabaseRetry<T>(
  scope: string,
  operation: () => Promise<T>,
  options: { attempts?: number; delayMs?: number } = {}
) {
  const attempts = options.attempts ?? 2;
  const delayMs = options.delayMs ?? 350;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isDatabaseConnectionError(error) || attempt === attempts) {
        throw error;
      }

      console.warn(`${scope}: database busy, retrying read (${attempt}/${attempts}).`);
      await wait(delayMs * attempt);
    }
  }

  throw lastError;
}

export function logDataAccessError(scope: string, error: unknown) {
  if (isDatabaseConnectionError(error)) {
    if (!loggedConnectionScopes.has(scope)) {
      loggedConnectionScopes.add(scope);
      console.warn(`${scope}: database temporarily unreachable.`);
    }

    return;
  }

  if (isDatabaseSchemaMismatchError(error)) {
    console.warn(`${scope}: database migration is pending.`);
    return;
  }

  console.error(scope, error);
}
