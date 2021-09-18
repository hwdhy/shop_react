import Create from "../../pages/products/Create";
import List from "../../pages/products/List";

//产品路由
export const productsRoutes = [
  {
    path: '/products/list',
    component: List,
    isShow:true,
    title : "商品列表",
  },
  {
    path: '/products/create',
    component: Create,
    isShow:false,
    title : '添加商品'
  }
]
