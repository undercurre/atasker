import ApiService from "../service/request/http";

const authApiService = new ApiService("http://localhost:3000");

export function login(params: { code: string; key: string; iv: string }) {
  return authApiService.post<{
    access_token: string;
    refresh_token: string;
    user_id: string;
  }>("/auth/wechat-login", params);
}

export const getPublicKey = () => {
  return authApiService.get<{ publicKey: string }>("/auth/public-key");
};
