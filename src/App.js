import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Frame from './components/Frame';

import httpInit from './utils/http'

import { isLogin } from './utils/auth';


//引入路由
import { homeRoutes } from './routes/home';
import { productsRoutes } from './routes/products';
import { notFoundRoutes } from './routes/notFound';
import { categoryRoutes } from './routes/category';
import { userRouters } from './routes/user';

import Login from './pages/home/Login';
import { adRouters } from './routes/ad';



function App() {

  //初始化http请求
  httpInit()

  return (
    isLogin() ? (
      <Frame>
        <Switch>
          {
            homeRoutes.map(route => {
              return (
                <Route key={route.path} {...route} />
              )
            })
          }
          {
            productsRoutes.map(route2 => {
              return (
                <Route key={route2.path} {...route2} />
              )
            })
          }
          {
            notFoundRoutes.map(route3 => {
              return (
                <Route key={route3.path} {...route3} />
              )
            })
          }
          {
            categoryRoutes.map(route4 => {
              return (
                <Route key={route4.path} {...route4} />
              )
            })
          }
          {
            adRouters.map(route5 => {
              return (
                <Route key={route5.path} {...route5} />
              )
            })
          }
          {
            userRouters.map(route6 => {
              return (
                <Route key={route6.path} {...route6} />
              )
            })
          }

          <Redirect to="/home/index" from="/" />
          <Redirect to="/404" />
        </Switch>
      </Frame>
    ) : (
      <div>
        <Route key='/home/login' path='/home/login' component={Login} />
        <Redirect to="/home/login" />
      </div>
    )

  )
}

export default App;
