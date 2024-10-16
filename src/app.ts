import { PropsWithChildren } from "react";
import { useLaunch } from "@tarojs/taro";

import "./app.scss";
import { getUserInfo } from "./apis/user";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    getUserInfo();
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
