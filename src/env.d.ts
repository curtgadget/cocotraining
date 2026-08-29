/// <reference types="astro/client" />

declare module 'cloudflare:workers' {
  export const env: {
    BASIC_AUTH_USER?: string;
    BASIC_AUTH_PASSWORD?: string;
  };
}
