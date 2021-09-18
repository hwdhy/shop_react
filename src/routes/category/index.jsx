import Create from "../../pages/category/Create";
import List from "../../pages/category/List";

//分类路由
export const categoryRoutes = [
  {
    path: '/category/list',
    component: List,
    isShow: true,
    title: '分类列表'
  },
  {
    path: '/category/create',
    component: Create,
    isShow: false,
    title: '创建分类'
  }

]