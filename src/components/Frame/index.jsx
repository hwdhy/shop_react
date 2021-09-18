import React from 'react'
import { Link} from 'react-router-dom';

//引入antd
import { Layout, Menu } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';

import {mainRoutes} from '../../routes/main'

import Logo from './a.png';
import '../../App.css'

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const mainRoute = mainRoutes.filter(route =>route.isShow === true);
console.log(mainRoutes);

function Frame(props) {
  return (
    <Layout>
        <Header className="header">
          <div className="logo">
            <img src={Logo} alt='logo' />
          </div>
        </Header>

        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >

              {
                mainRoute.map(routes => {
                  return <SubMenu key={routes.path} title={routes.name} icon={<MenuUnfoldOutlined />}>
                    {
                      routes.routes.filter(route => route.isShow === true).map(route => {
                        return <Menu.Item key={route.path}>
                          <Link to={route.path}>{route.title}</Link>
                        </Menu.Item>
                      })
                    }
                  </SubMenu>;
                })
              }

            </Menu>
          </Sider>
          <Layout style={{ padding: '0 16px 16px' }}>

            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
  )
}

export default Frame;
