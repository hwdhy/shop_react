import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Button,
  Card,
  Upload,
  Switch,
  AutoComplete,
  message,
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';

import { getToken } from '../../utils/auth';
import axios from 'axios';


function Create(props) {
  //获取父组件传递的参数 props
  const [initValue, setInitValue] = useState(props.location.state.data);

  //初始化图片列表
  let fileList = [];
  if (props.location.state.data.image_url) {
    fileList = [
      {
        name: '',
        url: props.location.state.data.image_url,
      }
    ]
  }

  //表单验证完成提交
  const onFinish = (values) => {
    console.log(values);

    let adPosition = options.find(item => item.value === values.name).id;

    //主图路径
    var image = ""
    if (values.image_url.fileList !== undefined) {
      image = "http://localhost/" + values.image_url.fileList[0].response.url
    } else {
      image = values.image_url
    }

    if (initValue.name !== undefined) {
      console.log("修改广告");
      axios.post(`/api1/admin/ad/update`, {
        id: initValue.id,
        ad_position_id: adPosition,
        enabled: values.enabled ? 1 : 2,
        content: values.content,
        image_url: image,
        link: values.link,
      }).then(
        res => {
          message.success("修改成功");
          console.log(res.data);
          props.history.push('/ad/list');
        },
        err => {
          if (err.status === 400) {
            message.error('修改失败');
          }

          if (err.status === 401) {
            message.error('登录失效，请重新登录');

            setTimeout(() => {
              localStorage.removeItem('token');
              props.history.push('/home/login');
            }, 500);
          }
        }
      )
    } else {
      console.log("添加广告");
      axios.post(`/api1/admin/ad/create`, {
        ad_position_id: adPosition,
        enabled: values.enabled ? 1 : 2,
        content: values.content,
        image_url: image,
        link: values.link,
      }).then(
        res => {
          message.success("添加成功");
          console.log(res.data);
          props.history.push('/ad/list');
        },
        err => {
          if (err.status === 400) {
            message.error('添加失败');
          }

          if (err.status === 401) {
            message.error('登录失效，请重新登录');

            setTimeout(() => {
              localStorage.removeItem('token');
              props.history.push('/home/login');
            }, 500);
          }
        }
      )
    }

  }

  //表单验证失败
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  //广告位置列表
  const [options, setOptions] = useState([]);

  //加载完成初始化广告位置数据
  useEffect(
    () => {
      axios.post('/api1/admin/adposition/list')
        .then(
          res => {
            console.log(res.data.data);
            setOptions(res.data.data);
          },
          err => {
            console.log(err);
          }
        )
    }, []
  )

  return (
    <Card title={initValue.name ? "修改广告" : "添加广告"}>
      <Form
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >

        <Form.Item
          label="广告位置"
          name="name"
          initialValue={initValue.name}
        >
          <AutoComplete
            style={{
              width: 200,
            }}
            defaultValue={initValue.name ? initValue.name : ''}
            options={options}
            allowClear={true}
            placeholder="点击选择"
            filterOption={(inputValue, option) =>
              option.value.indexOf(inputValue) !== -1
            }
          />
        </Form.Item>



        <Form.Item
          label="广告图片"
          name="image_url"
          initialValue={initValue.image_url}
        >
          <Upload
            action="http://localhost:3000/api1/admin/picture/upload"
            headers={{ token: getToken() }}
            multiple={true}
            listType="picture"
            defaultFileList={[...fileList]}
            className="upload-list-inline">
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="是否启用"
          name="enabled"
          initialValue={initValue.enabled === 1 ? true : false}
          valuePropName="checked"
        >

          <Switch />
        </Form.Item>

        <Form.Item
          label="跳转路径"
          name="link"
          initialValue={initValue.link}
        >

          <Input />
        </Form.Item>

        <Form.Item
          label="广告内容"
          name="content"
          initialValue={initValue.content}
        >

          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            {initValue.name ? "修改" : "添加"}
          </Button>
        </Form.Item>
      </Form>
    </Card >
  )
}

export default Create
