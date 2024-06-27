import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "收集",
    icon: "book",
    link: "/collect/dev",
  },
/*   {
    text: "安装",
    icon: "pen-to-square",
    prefix: "/install/",
    children: [
      {
        text: "win",
        icon: "pen-to-square",
        prefix: "apple/",
        children: [
          { text: "苹果1", icon: "pen-to-square", link: "1" },
          { text: "苹果2", icon: "pen-to-square", link: "2" },
        ],
      },
    ],
  }, */
]);
