
import Create from '../../pages/ad/Create';
import List  from '../../pages/ad/List';

export const adRouters = [
  {
    path: '/ad/list',
    component: List,
    isShow: true,
    title: '广告列表'
  },
  {
    path: '/ad/create',
    component: Create,
    isShow: false,
    title: '添加广告'
  }
]