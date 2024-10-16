import ApiService from "../service/request/http";

const authApiService = new ApiService("http://localhost:3000");

export function login(params: { code: string; key: string; iv: string }) {
  return authApiService.post<{
    accessToken: string;
    user_id: string;
  }>("/auth/wechat-login", params);
}

export function getPublicKey() {
  return authApiService.get<{ publicKey: string }>("/auth/public-key");
}
