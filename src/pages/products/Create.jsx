import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  Switch,
  Card,
  message,
  Upload,
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';

//富文本组件
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css';
import './products.css';   //富文本边框样式

import { getToken } from '../../utils/auth';
import axios from 'axios';


function Create(props) {

  let fileList = [];

  if (props.location.state.data.list_pic_url) {
    fileList = [
      {
        name: '',
        url: props.location.state.data.list_pic_url,
      }
    ]
  }

  //初始化数据
  const [initValue, setInitValue] = useState(props.location.state.data);
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(props.location.state.data.goods_desc));

  //添加修改商品 按钮状态
  const [createing, setCreateing] = useState(false);
  const [updating, setUpdating] = useState(false);

  //表单提交 -- 验证成功
  const onFinish = (values) => {

    //主图路径
    var image = ""
    if (values.list_pic_url.fileList !== undefined) {
      image = "http://localhost/" + values.list_pic_url.fileList[0].response.url
    } else {
      image = values.list_pic_url
    }

    if (initValue.name !== undefined) {
      console.log("修改产品",values);
      setUpdating(true);

      axios.post('/api1/admin/goods/update', {
        id: initValue.id,
        name: values.name,
        retail_price: values.retail_price,
        goods_number: values.goods_number,
        sort_order: values.sort_order,
        is_hot: values.is_hot ? 1 : 2,
        is_new: values.is_new ? 1 : 2,
        goods_brief: values.goods_brief,
        goods_desc: values.goods_desc.toHTML(),
        list_pic_url: image,
      }).then(
        res => {
          setCreateing(false);
          if (res.status === 200) {
            message.success('修改成功');
            props.history.push('/products/list');
          }
        },
        err => {
          if (err.status === 400) {
            message.error('修改失败');
            setUpdating(false);
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
      console.log("新增产品", values);
      setCreateing(true);

      //todo 商品视图待处理
      // var images = []
      // values.list_pic_url.fileList.map(
      //   (file) =>{
      //     images.push(file.response.url)
      //   }
      // )

      axios.post('/api1/admin/goods/create', {
        name: values.name,
        retail_price: values.retail_price,
        goods_number: values.goods_number,
        sort_order: values.sort_order,
        is_hot: values.is_hot ? 1 : 2,
        is_new: values.is_new ? 1 : 2,
        goods_brief: values.goods_brief,
        goods_desc: values.goods_desc.toHTML(),
        list_pic_url: image,
      }).then(
        res => {
          if (res.status === 200) {
            message.success('添加成功');
            props.history.push('/products/list');
          }
        },
        err => {
          if (err.status === 400) {
            setCreateing(false);
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
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = (editorState) => {
    setEditorState(editorState);
  }

  const myUploadFn = (param) => {
    const serverUrl = '/api1/admin/picture/upload'
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = (res) => {
      let responseJosn = JSON.parse(res.srcElement.responseText)
      param.success({
        url: "http://localhost/" + responseJosn.url,
        meta: {
          loop: true,
          autoPlay: true,
          controls: true,
          //返回输入框的图片路径
          src: "http://localhost/" + responseJosn.url,
        }

      })
    }
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    }
    xhr.upload.addEventListener('progress', progressFn);
    xhr.addEventListener('load', successFn);
    xhr.addEventListener('error', errorFn);

    fd.append('file', param.file);
    xhr.open('POST', serverUrl, true);
    xhr.setRequestHeader('token', getToken())
    xhr.send(fd);
  }

  return (
    <Card title={initValue.name ? '修改商品' : '添加商品'}>
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
          label="商品名称"
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
          label="价格（/元）"
          name="retail_price"
          initialValue={initValue.retail_price}
          rules={[
            {
              required: true,
              message: 'Please input your retail_price!',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="商品数量"
          name="goods_number"
          initialValue={initValue.goods_number}
          wrapperCol={{
            span: 2,
          }}
          rules={[
            {
              required: true,
              message: 'Please input your goods_number!',
            },
          ]}
        >
          <InputNumber />
          {/* <Input type="number" suffix="件" /> */}
        </Form.Item>

        <Form.Item
          label="商品排序"
          name="sort_order"
          initialValue={initValue.sort_order}
          wrapperCol={{
            span: 2,
          }}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="是否热销"
          name="is_hot"
          initialValue={initValue.is_hot === 1 ? true : false}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="是否新品"
          name="is_new"
          initialValue={initValue.is_new === 1 ? true : false}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="商品简介"
          name="goods_brief"
          initialValue={initValue.goods_brief}
        >

          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="图片上传"
          name="list_pic_url"
          initialValue={initValue.list_pic_url}
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
          label="商品描述"
          name="goods_desc"
          initialValue={editorState}
        >
          <BraftEditor
            className="myBrafed"
            // excludeControls={['media']}
            contentStyle={{ height: 450 }}
            onChange={handleChange}
            media={{ uploadFn: myUploadFn }}
          />

        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            {createing ? '添加商品中' : updating ? '修改商品中' : initValue.name ? '修改商品' : '添加商品'}
          </Button>
        </Form.Item>
      </Form>
    </Card >
  )

}
export default Create;
