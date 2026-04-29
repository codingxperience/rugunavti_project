export function isPlaceholderDisplayName(value: string | null | undefined) {
  if (!value) {
    return true;
  }

  const normalized = value.trim().replace(/\s+/g, " ").toLowerCase();

  return [
    "ruguna learner",
    "ruguna student",
    "ruguna user",
    "learner",
    "student",
    "user",
  ].includes(normalized);
}

export function deriveDisplayNameFromEmail(email: string | null | undefined) {
  if (!email) {
    return null;
  }

  const [localPart, domain] = email.split("@");

  if (!localPart?.trim() || domain?.trim().toLowerCase() === "ruguna.local") {
    return null;
  }

  const words = localPart
    .split(/[._-]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  return words.length ? words.join(" ") : null;
}

export function resolveDisplayName(input: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  fallback?: string;
}): string {
  const profileName = [input.firstName, input.lastName].filter(Boolean).join(" ").trim();
  const preferredName = profileName || input.name?.trim() || null;

  if (preferredName && !isPlaceholderDisplayName(preferredName)) {
    return preferredName;
  }

  return deriveDisplayNameFromEmail(input.email) || input.fallback || "Learner";
}

export function splitResolvedDisplayName(input: {
  name?: string | null;
  email?: string | null;
  fallback?: string;
}) {
  const resolvedName = resolveDisplayName(input);
  const parts = resolvedName.split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? input.fallback ?? "Learner",
    lastName: parts.slice(1).join(" "),
  };
}

export function getDisplayInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "R"
  );
}
