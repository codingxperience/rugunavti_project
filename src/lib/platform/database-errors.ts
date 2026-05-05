import "server-only";

const loggedConnectionScopes = new Set<string>();

type PrismaLikeError = {
  code?: string;
  name?: string;
  message?: string;
  meta?: {
    database_location?: string;
    modelName?: string;
  };
};

export function isDatabaseConnectionError(error: unknown) {
  const value = error as PrismaLikeError;
  const message = value?.message ?? "";

  return (
    value?.code === "P1001" ||
    value?.name === "PrismaClientInitializationError" ||
    message.includes("Can't reach database server")
  );
}

export function getDatabaseUnavailableMessage(error?: unknown) {
  const value = error as PrismaLikeError | undefined;
  const location = value?.meta?.database_location;

  return location
    ? `Ruguna could not reach the database at ${location}.`
    : "Ruguna could not reach the database.";
}

export function logDataAccessError(scope: string, error: unknown) {
  if (isDatabaseConnectionError(error)) {
    if (!loggedConnectionScopes.has(scope)) {
      loggedConnectionScopes.add(scope);
      console.warn(`${scope}: database temporarily unreachable.`);
    }

    return;
  }

  console.error(scope, error);
}
