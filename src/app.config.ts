export default defineAppConfig({
  pages: ["pages/login/index", "pages/index/index", "pages/personal/index"],

  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },

  tabBar: {
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "Home",
        iconPath: "assets/icons/home.png",
        selectedIconPath: "assets/icons/home_selected.png",
      },
      {
        pagePath: "pages/personal/index",
        text: "Personal",
        iconPath: "assets/icons/personal.png",
        selectedIconPath: "assets/icons/personal_selected.png",
      },
    ],
  },
});
