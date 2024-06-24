import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "黑色的小火苗",
  description: "",

  theme,
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
