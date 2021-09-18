import axios from 'axios'
import React, { useEffect } from 'react'

import { Card, Table, Button, Popconfirm, message } from "antd";
import Loading from "../../components/Loading";

import { Link } from 'react-router-dom';

import './user.css';

function List(props) {
  const [current, setCurrent] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [dataSource, setDataSource] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 100,
      render: (text) => {
        return <img src={text} className="image" />
      }
    },
    {
      title: '用户名',
      dataIndex: 'nick_name',
      width: 100,
    },
    {
      title: '微信ID',
      dataIndex: 'weixin_openid',
      width: 100,
    },
    {
      title: '注册时间',
      dataIndex: 'register_time',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 150,
    },
    {
      title: '最后登录IP',
      dataIndex: 'last_login_ip',
      width: 150,
    },
    {
      title: '最后登录时间',
      dataIndex: 'last_login_time',
      width: 200,
    },
    // {
    //   title: "操作",
    //   //record 返回数据  index 下标
    //   render: (txt, record, index) => {
    //     return (
    //       <div>
    //         <Button size="small" style={{ margin: "0 1rem" }} type="primary">
    //           <Link
    //             to={{ pathname: "/user/create", state: { data: record } }}
    //           >
    //             修改
    //           </Link>
    //         </Button>

    //         <Popconfirm
    //           title="确定要删除吗？"
    //           // onCancel={() => console.log('用户取消删除')}

    //           onConfirm={() => {
    //             axios
    //               .post(`/api1/admin/user/delete`, { id: record.id })
    //               .then(
    //                 (res) => {
    //                   if (res.status === 200) {
    //                     setDataSource(
    //                       dataSource.filter((item) => item.id !== record.id)
    //                     );
    //                   }
    //                 },
    //                 (err) => {
    //                   if (err.status === 401) {
    //                     message.warning("登录失效");
    //                     localStorage.removeItem("token");
    //                     props.history.push("/home/login");
    //                   } else {
    //                     message.error("服务器请求错误！");
    //                   }
    //                 }
    //               );
    //           }}
    //         >
    //           <Button size="small" type="danger">
    //             删除
    //           </Button>
    //         </Popconfirm>
    //       </div>
    //     );
    //   },
    // }
  ];

  useEffect(
    () => {
      axios.post('/api1/admin/user/list',
        {
          current: current,
          page_size: pageSize
        }).then(
          res => {
            setCurrent(res.data.current);
            setPageSize(res.data.page_size);
            setTotal(res.data.total);
            setDataSource(res.data.data);
            setLoading(true);
          },
          err => {
            console.log("err:", err);
          }
        )
    }, []
  );

  const changeHandler = (current, pageSize) => {

  }

  return loading ? (
    <Card
      title="用户列表"
      // extra={
      //   <Button type="primary" size="small">
      //     <Link to={{ pathname: "/user/create", state: { data: "" } }}>
      //       新增
      //     </Link>
      //   </Button>
      // }
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
      title="用户列表"
      // extra={
      //   <Button type="primary" size="small">
      //     <Link to={{ pathname: "/user/create", state: { data: "" } }}>
      //       新增
      //     </Link>
      //   </Button>
      // }
    >
      <Loading />
    </Card>
  );
}

export default List
