import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import "./index.scss";

export default function Login() {
  const handleLogin = async () => {
    try {
      // 发起微信登录
      const loginResult = await Taro.login();
      const { code } = loginResult;

      // 这里可以将 code 发送到你的服务器进行换取用户的 session
      const res = await Taro.request({
        url: "https://your-api-url/login", // 替换为你的登录接口
        method: "POST",
        data: { code },
      });

      if (res.statusCode === 200) {
        Taro.showToast({ title: "登录成功", icon: "success" });
        // 处理登录成功后的逻辑，比如跳转页面
      }
    } catch (error) {
      Taro.showToast({ title: "登录失败", icon: "none" });
      console.error("Login error:", error);
    }
  };

  return (
    <View className='login'>
      <Button onClick={handleLogin}>微信登录</Button>
    </View>
  );
}
