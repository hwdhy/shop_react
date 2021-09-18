import React, { useEffect, useState } from 'react'

import axios from 'axios';
import { Link } from "react-router-dom";

import Loading from "../../components/Loading";

import { Card, Table, Button, Switch, Popconfirm, Input, message } from "antd";

import './ad.css';

function List(props) {

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: '广告位置',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '广告图片',
      dataIndex: 'image_url',
      width: 200,
      render: (text) => {
        return <img className="adImage" src={text} />
      }
    },
    {
      title: '跳转路径',
      dataIndex: 'link',
      width: 320,
    },
    {
      title: '广告内容',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      width: 200,
      render: (text, record) => {
        return <Switch defaultChecked={text === 1 ? true : false}
          onChange={
            (checked, event) => {
              const enabled = checked ? 1 : 2;
              axios.post('/api1/admin/ad/update', {
                id: record.id,
                enabled: enabled
              }).then(
                res => {
                  if (res.status === 200) {
                    message.success("修改成功");
                  }
                },
                err => {
                  if (err.status === 401) {
                    message.warning("登录失效");
                    localStorage.removeItem("token");
                    props.history.push("/home/login");
                  } else {
                    message.error("修改失败，请刷新页面重新操作！");
                  }
                }
              )
            }}
        />
      }
    },
    {
      title: "操作",
      //record 返回数据  index 下标
      render: (txt, record, index) => {
        return (
          <div>
            <Button size="small" style={{ margin: "0 1rem" }} type="primary">
              <Link
                to={{ pathname: "/ad/create", state: { data: record } }}
              >
                修改
              </Link>
            </Button>

            <Popconfirm
              title="确定要删除吗？"
              // onCancel={() => console.log('用户取消删除')}

              onConfirm={() => {
                axios
                  .post(`/api1/admin/ad/delete`, { id: record.id })
                  .then(
                    (res) => {
                      if (res.status === 200) {
                        setDataSource(
                          dataSource.filter((item) => item.id !== record.id)
                        );
                      }
                    },
                    (err) => {
                      if (err.status === 401) {
                        message.warning("登录失效");
                        localStorage.removeItem("token");
                        props.history.push("/home/login");
                      } else {
                        message.error("服务器请求错误！");
                      }
                    }
                  );
              }}
            >
              <Button size="small" type="danger">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },

  ]

  //翻页操作
  const changeHandler = (current, pageSize) => {
    setLoading(false);
    axios
      .post(`/api1/admin/ad/list`, {
        current: current,
        page_size: pageSize,
      })
      .then(
        (res) => {
          setLoading(true);
          setCurrent(res.data.current);
          setPageSize(res.data.page_size);
          setDataSource(res.data.data);
        },
        (err) => {
          localStorage.removeItem("token");
          props.history.push("/home/login");
        }
      );
  };

  //初次渲染页面加载数据
  useEffect(() => {
    axios
      .post(`/api1/admin/ad/list`, {
        current: current,
        page_size: pageSize,
      })
      .then(
        (res) => {
          setCurrent(res.data.current);
          setPageSize(res.data.page_size);
          setDataSource(res.data.data);
          setLoading(true);
        },
        (err) => {
          localStorage.removeItem("token");
          props.history.push("/home/login");
        }
      );
  }, []);

  return loading ? (
    <Card
      title="广告列表"
      extra={
        <Button type="primary" size="small">
          <Link to={{ pathname: "/ad/create", state: { data: "" } }}>
            新增
          </Link>
        </Button>
      }
    >
      <Table
        columns={columns}
        bordered
        dataSource={dataSource}
        rowKey={(columns) => columns.id}
        pagination={{
          defaultCurrent: current,
          defaultPageSize: pageSize,
          total: total,
          showSizeChanger: true,
          onChange: changeHandler,
        }}
      />
    </Card>
  ) : (
    <Card
      title="广告列表"
      extra={
        <Button type="primary" size="small">
          <Link to={{ pathname: "/ad/create", state: { data: "" } }}>
            新增
          </Link>
        </Button>
      }
    >
      <Loading />
    </Card>
  );
}

export default List
