import { loadEnvConfig } from "@next/env";

async function main() {
  loadEnvConfig(process.cwd());

  const {
    getMissingProductionEnv,
    getProductionEnvWarnings,
    requiredProductionEnvKeys,
  } = await import("../src/lib/platform/env");

  const missing = getMissingProductionEnv();
  const warnings = getProductionEnvWarnings();

  console.log("Ruguna production environment check");
  console.log(`Required keys checked: ${requiredProductionEnvKeys.length}`);

  if (missing.length) {
    console.error("\nMissing required production environment variables:");
    for (const key of missing) {
      console.error(`- ${key}`);
    }
  }

  if (warnings.length) {
    console.error("\nProduction configuration warnings:");
    for (const warning of warnings) {
      console.error(`- ${warning}`);
    }
  }

  if (missing.length || warnings.length) {
    console.error("\nProduction check failed. Fix the environment before deploying.");
    process.exit(1);
  }

  console.log("Production environment check passed.");
}

void main();
