import Taro from "@tarojs/taro";
import { View, Button, Image } from "@tarojs/components";
import "./index.scss";
import CryptoJS from "crypto-js";
import * as forge from "node-forge";
import { getPublicKey, login } from "../../apis/auth";
import { useEffect } from "react";
import { localStg } from "../../service/storage/local";

export default function Login() {
  let pubKey = "";

  async function fetchPub() {
    const pubKeyRes = await getPublicKey();
    pubKey = pubKeyRes.publicKey;
  }

  useEffect(() => {
    fetchPub();
  }, []);

  async function encryptDataWithPem(
    publicKeyPem: string,
    data: string
  ): Promise<string> {
    const key = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedData = key.encrypt(data, "RSA-OAEP");

    return forge.util.encode64(encryptedData);
  }

  const handleLogin = async () => {
    try {
      // 发起微信登录
      const loginResult = await Taro.login();
      const { code } = loginResult;
      console.log("code", code);

      // 生成随机对称密钥
      const symmetricKey = CryptoJS.lib.WordArray.random(32);
      const symmetricKeyBase64 = CryptoJS.enc.Base64.stringify(symmetricKey);

      // 这里可以将 code 发送到你的服务器进行换取用户的 session
      const key = CryptoJS.enc.Base64.parse(symmetricKeyBase64);
      const sourceIv = CryptoJS.lib.WordArray.random(128 / 8);
      const ivBase64 = CryptoJS.enc.Base64.stringify(sourceIv);
      const iv = CryptoJS.enc.Base64.parse(ivBase64);
      const encryptedCode = CryptoJS.AES.encrypt(code, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC, // 使用 CBC 模式
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      const encryptedSymmetricKey = await encryptDataWithPem(
        pubKey,
        symmetricKeyBase64
      );

      const res = await login({
        code: encryptedCode,
        key: encryptedSymmetricKey,
        iv: ivBase64,
      });
      if (res.accessToken) {
        Taro.showToast({ title: "登录成功", icon: "success" });
        // 处理登录成功后的逻辑，比如跳转页面
        localStg.set("token", res.accessToken);
        localStg.set("userId", res.user_id);
        Taro.reLaunch({ url: "/pages/index/index" });
      }
    } catch (error) {
      Taro.showToast({ title: "登录失败", icon: "none" });
      console.error("Login error:", error);
    }
  };

  return (
    <View className="login-container">
      <View className="logo-section">
        <Image
          className="logo"
          src="https://raw.githubusercontent.com/undercurre/Image/refs/heads/main/atasker.png"
        />
      </View>
      <View className="title-section">
        <View className="app-title">欢迎使用我们的App</View>
        <View className="app-subtitle">请使用微信登录继续</View>
      </View>
      <Button className="login-button" onTap={handleLogin}>
        <Image
          className="wx-icon"
          src="https://raw.githubusercontent.com/undercurre/Image/refs/heads/main/weixin_white.png"
        />
        微信登录
      </Button>
    </View>
  );
}
