import { basicAuthHeader, request } from "./client";

export async function verifyAdmin(username: string, password: string): Promise<string> {
  const authHeader = basicAuthHeader(username, password);
  await request("/auth/login", { method: "POST", authHeader });
  return authHeader;
}
