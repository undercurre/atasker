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

export interface updateUserInfoParams {
  nickname?: string;
  avatar_url?: string;
  user: {
    id: string;
    phone?: string;
  };
}

export async function getUserInfo() {
  const userId = await localStg.get("userId");
  return userApiService.get<WechatUserInfo>(`/wechat_users/${userId}`);
}

export async function updateUserInfo(data: updateUserInfoParams) {
  const userId = await localStg.get("userId");
  data.user.id = userId;
  return userApiService.post<WechatUserInfo>("/wechat_users", data);
}
