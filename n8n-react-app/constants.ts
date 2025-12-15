// In a real build pipeline, these would be injected via process.env or import.meta.env
// For this generated code to be "runnable" but secure, we check for the env var or default to a placeholder
// that the user must configure.

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://primary-production-url.n8n.cloud/webhook';

export const APP_CONFIG = {
  appName: 'Sheet Manager',
  apiTimeout: 10000, // 10 seconds
};
