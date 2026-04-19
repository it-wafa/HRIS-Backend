/**
 * Runtime environment configuration
 * Read from window.__ENV__ injected at container startup.
 * Falls back to localhost for local development.
 */
declare global {
  interface Window {
    __ENV__: {
      API_URL: string;
      GOOGLE_MAPS_API_KEY: string;
    };
  }
}

export {};

const env = typeof window !== "undefined" ? window.__ENV__ : undefined;

export const API_URL: string =
  env?.API_URL && env.API_URL !== "$API_URL"
    ? env.API_URL
    : import.meta.env.API_URL || "http://localhost:8080";

export const GOOGLE_MAPS_API_KEY: string =
  env?.GOOGLE_MAPS_API_KEY && env.GOOGLE_MAPS_API_KEY !== "$GOOGLE_MAPS_API_KEY"
    ? env.GOOGLE_MAPS_API_KEY
    : import.meta.env.GOOGLE_MAPS_API_KEY || "";
