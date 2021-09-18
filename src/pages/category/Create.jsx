import React from 'react'
import {
  Form,
  Input,
  Button,
  Card,
  InputNumber,
  Upload,
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';

import { getToken } from '../../utils/auth';


function Create(props) {

  const [initValue, setInitValue] = React.useState(props.location.state.data);

  let fileList = [];
  if (props.location.state.data.wap_banner_url) {
    fileList = [
      {
        name: '',
        url: props.location.state.data.wap_banner_url,
      }
    ]
  }

  const onFinish = (values) => {
    console.log(values);
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card title={initValue.name?"修改分类":"添加分类"}>
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
          label="分类名称"
          name="name"
          initialValue={initValue.name}
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="上级ID"
          name="parent_id"
          initialValue={initValue.parent_id}
          rules={[
            {
              required: true,
              message: 'Please input your parent_id!',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="分类排序"
          name="sort_order"
          initialValue={initValue.sort_order}
          wrapperCol={{
            span: 2,
          }}
        >
          <InputNumber />
        </Form.Item>


        <Form.Item
          label="分类图片"
          name="wap_banner_url"
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
          label="前台名称"
          name="front_name"
          initialValue={initValue.front_name}
        >

          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="前台描述"
          name="front_desc"
          initialValue={initValue.front_desc}
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
            添加分类
          </Button>
        </Form.Item>
      </Form>
    </Card >
  )
}

export default Create
