import Index from "../../pages/home/Index";
import Login from "../../pages/home/Login";

//主页路由
export const homeRoutes = [
  {
    path: '/home/index',
    component: Index,
    isShow: true,
    title: '首页',
  },
  {
    path: "/home/login",
    component: Login,
    isShow: false,
    title: "登录",
  }
]