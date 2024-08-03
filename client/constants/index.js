const tryFetchEnvVar = (envVarName) => {
  const envVar = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!envVar) throw new Error(`env var ${envVarName} does not exist`);
  return envVar;
};

export const STRIPE_PUBLISHABLE_KEY = tryFetchEnvVar(
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
);
