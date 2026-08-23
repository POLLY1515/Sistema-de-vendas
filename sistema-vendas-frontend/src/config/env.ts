const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.trim() || "local";

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL nao esta configurada.");
}

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ""),
  appEnv,
} as const;
