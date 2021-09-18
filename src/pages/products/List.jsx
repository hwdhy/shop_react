import React, { useEffect, useState } from "react";
import { Card, Table, Button, Popconfirm, Input, message } from "antd";

import { Link } from "react-router-dom";
import axios from "axios";

import Loading from "../../components/Loading";

import "./products.css";

function List(props) {
  const columns = [
    {
      title: "ID",
      key: "id",
      width: 100,
      align: "center",
      dataIndex: "id",
    },
    {
      title: "产品名称",
      width: 320,
      dataIndex: "name",
    },
    {
      title: "图片",
      dataIndex: "list_pic_url",
      render: (text) => <img className="productImage" src={text} />,
    },
    {
      title: "零售价 (/元)",
      dataIndex: "retail_price",
    },
    {
      title: "排序",
      dataIndex: "sort_order",
      editable: true,
      width: 180,
      render: (text, record, index) => {
        return (
          <Input
            style={{
              width: 100,
              height: "32px",
              textAlign: "center",
              border: "1px solid #ccc",
            }}
            type="text"
            defaultValue={text}
            onBlur={(e) => {
              const newValue = e.target.value;
              const newRecord = { ...record, sort_order: parseInt(newValue) };

              axios
                .post("/api1/admin/goods/update", {
                  id: record.id,
                  sort_order: newRecord.sort_order,
                })
                .then(() => {
                  message.success("排序修改成功");
                });
            }}
          />
        );
      },
    },
    {
      title: "操作",
      //record 返回数据  index 下标
      render: (txt, record, index) => {
        return (
          <div>
            <Button size="small" style={{ margin: "0 1rem" }} type="primary">
              <Link
                to={{ pathname: "/products/create", state: { data: record } }}
              >
                修改
              </Link>
            </Button>

            <Popconfirm
              title="确定要删除吗？"
              // onCancel={() => console.log('用户取消删除')}

              onConfirm={() => {
                axios.post(`/api1/admin/goods/delete`, { id: record.id }).then(
                  (res) => {
                    console.log(res);
                    if (res.status === 200) {
                      setDataSource(
                        dataSource.filter((item) => item.id !== record.id)
                      );
                    }
                  },
                  (err) => {
                    console.log(err);
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
  ];

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  //初次渲染页面加载数据
  useEffect(() => {
    axios
      .post(`/api1/admin/goods/list`, {
        current: current,
        page_size: pageSize,
      })
      .then(
        (res) => {
          setCurrent(res.data.current);
          setPageSize(res.data.page_size);
          setTotal(res.data.total);
          setDataSource(res.data.data);
          setLoading(false);
        },
        (err) => {
          localStorage.removeItem("token");
          props.history.push("/home/login");
        }
      );
  }, []);

  //翻页操作
  const changeHandler = (current, pageSize) => {
    setLoading(true);
    axios
      .post(`/api1/admin/goods/list`, {
        current: current,
        page_size: pageSize,
      })
      .then(
        (res) => {
          setCurrent(res.data.current);
          setPageSize(res.data.page_size);
          setDataSource(res.data.data);
          setLoading(false);
        },
        (err) => {
          localStorage.removeItem("token");
          props.history.push("/home/login");
        }
      );
  };

  return (
    <Card
      title="商品列表"
      extra={
        <Button type="primary" size="small">
          <Link to={{ pathname: "/products/create", state: { data: "" } }}>
            新增
          </Link>
        </Button>
      }
    >
      <Table
        loading={loading}
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
  )
}

export default List;
