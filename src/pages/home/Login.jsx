import React from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';

import './index.css'
import axios from 'axios';

import { setToken } from '../../utils/auth';

function Login(props) {

  const onFinish = (values) => {
    console.log("success:" + values.username + values.password);

    axios.post('/api1/admin/user/login', {
      username: values.username,
      password: values.password
    }).then(
      (response) => {
        if (response.status === 200) {
          message.success('登录成功');
          let expire = new Date().getTime() + (1000 * 60 * 60);
          setToken('token', response.data.token, expire);
          props.history.push('/home/index');
          window.location.reload();
        }
        
      },
      (error) => {
        message.error("用户不存在！！！");
      }
    )
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-page" >
      <div className="backgroundBox">
        <Card title="Management system" className="login-form" >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="box"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default Login;
