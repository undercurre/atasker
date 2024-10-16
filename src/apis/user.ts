import { localStg } from "../service/storage/local";
import ApiService from "../service/request/http";

const userApiService = new ApiService("http://localhost:3003");

export interface WechatUserInfo {
  id: string;
  openid: string;
  unionid: string;
  nickname: string;
  avatar_url: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone: string | null;
    created_at: string;
    updated_at: string;
  };
}

export async function getUserInfo() {
  const userId = await localStg.get("userId");
  console.log(userId);
  return userApiService.get<WechatUserInfo>(`/wechat_users/${userId}`);
}
