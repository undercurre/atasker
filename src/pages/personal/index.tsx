import Taro from "@tarojs/taro";
import { View, Text, Button, Image, Input } from "@tarojs/components";
import { useEffect, useState } from "react";
import "./index.scss";
import { getUserInfo, WechatUserInfo } from "../../apis/user";
import { localStg } from "../../service/storage/local";

const Personal = () => {
  const [userInfo, setUserInfo] = useState<WechatUserInfo>({
    id: "",
    openid: "",
    unionid: "",
    nickname: "",
    avatar_url:
      "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
    user: {
      id: "",
      username: "微信用户",
      email: "",
      phone: "",
      created_at: "",
      updated_at: "",
    },
  });

  async function fetchUserInfo() {
    const profile = await getUserInfo();
    setUserInfo(profile);
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    await localStg.clear();
    Taro.reLaunch({ url: "/pages/login/index" });
  };

  function onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    setUserInfo((preState) => {
      return {
        ...preState,
        avatar_url: avatarUrl,
      };
    });
  }

  function onNickNameReview(e) {
    const { value } = e.detail;
    setUserInfo((preState) => {
      return {
        ...preState,
        user: {
          ...preState.user,
          username: value,
        },
      };
    });
  }

  return (
    <View className="personal-container">
      <View className="user-info">
        <Button
          className="avatar_wrap"
          open-type="chooseAvatar"
          onChooseAvatar={onChooseAvatar}
        >
          <Image className="avatar" src={userInfo.avatar_url}></Image>
        </Button>
        <Input
          type="nickname"
          className="username"
          value={userInfo.user.username}
          placeholder="请输入昵称"
          onInput={onNickNameReview}
        />
      </View>
      <View className="user-details">
        <View className="detail-item">
          <Text className="label">Email: </Text>
          <Text className="value">{userInfo.user.email}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">Phone: </Text>
          <Text className="value">{userInfo.user.phone}</Text>
        </View>
      </View>
      <Button className="btn logout-btn" onClick={handleLogout}>
        退出登录
      </Button>
    </View>
  );
};

export default Personal;
