import path from 'path';
import dotenv from 'dotenv';

// Local runs read .env; in CI the variables come from the workflow.
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Add it to src/config/.env (see src/config/.env.example).`);
  }
  return value;
}

export const settings = {
  baseURL: required('BASE_URL'),
  // Read lazily: only performance tests need the key.
  get pageSpeedApiKey(): string {
    return required('PAGESPEED_API_KEY');
  },
};
