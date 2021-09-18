import Create from "../../pages/user/Create";
import List from "../../pages/user/List";

export const userRouters = [
  {
    path: '/user/list',
    component: List,
    title: '用户列表',
    isShow: true
  },
  {
    path: '/user/create',
    component: Create,
    title: '添加用户',
    isShow: false
  }
]