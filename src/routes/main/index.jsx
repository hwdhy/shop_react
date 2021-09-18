import { adRouters } from "../ad";
import { categoryRoutes } from "../category";
import { homeRoutes } from "../home";
import { productsRoutes } from "../products";
import { userRouters } from "../user";

//一级目录
export const mainRoutes = [
  {
    path: '/home',
    isShow: true,
    name: '首页',
    routes: homeRoutes
  },
  {
    path: '/products',
    isShow: true,
    name: '产品管理',
    routes: productsRoutes
  },
  {
    path: '/category',
    isShow: true,
    name: '分类管理',
    routes: categoryRoutes
  },
  {
    path: '/ad',
    isShow: true,
    name: '广告管理',
    routes: adRouters
  },
  {
    path: '/user',
    isShow: true,
    name: '用户管理',
    routes: userRouters
  }
]