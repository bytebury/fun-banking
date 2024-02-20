import { AppConstants } from "../constants/app-constants";

export async function POST(url: string, payload: unknown): Promise<Response> {
  const token = localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
  const headers = { Authorization: token ?? "" };
  return fetch(`${AppConstants.BACKEND_URL}${url}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers,
  });
}

export async function PUT(url: string, payload: unknown): Promise<Response> {
  const token = localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
  const headers = { Authorization: token ?? "" };
  return fetch(`${AppConstants.BACKEND_URL}${url}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers,
  });
}

export async function PATCH(url: string, payload: unknown): Promise<Response> {
  const token = localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
  const headers = { Authorization: token ?? "" };
  return fetch(`${AppConstants.BACKEND_URL}${url}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers,
  });
}

export async function DELETE(url: string): Promise<Response> {
  const token = localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
  const headers = { Authorization: token ?? "" };
  return fetch(`${AppConstants.BACKEND_URL}${url}`, { method: "DELETE", headers });
}

export async function GET(url: string): Promise<Response> {
  const token = localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
  const headers = { Authorization: token ?? "" };
  return fetch(`${AppConstants.BACKEND_URL}${url}`, { method: "GET", headers });
}
