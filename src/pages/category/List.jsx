import React, { useEffect, useState } from "react";
import { Card, Table, Button, Popconfirm, Input, message } from "antd";

import axios from "axios";

import Loading from "../../components/Loading";

import { Link } from "react-router-dom";

import "./category.css";

function List(props) {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState(0);

  const [category, setCategory] = useState(1);

  //是否显示
  //显示下标
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 200,
      align: "center",
    },
    {
      title: "分类名称",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "父ID",
      dataIndex: "parent_id",
      width: 200,
      render: (text) => {
        return text == 0 ? "一级分类" : "二级分类";
      }
    },
    {
      title: "图片",
      dataIndex: "wap_banner_url",
      width: 200,
      render: (text) => <img className="categoryImage" src={text} />,
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
                .post("/api1/admin/category/update", {
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
      title: "下级分类",
      render: (text, record, index) => {
        return (
          <Link
            onClick={() => {
              setCurrent(1);
              setPageSize(10);
              if (category === 2) {   //返回上一级
                setParentId(0);
                axios.post("/api1/admin/category/list", {
                  current: current,
                  parent_id: 0,
                  page_size: pageSize,
                })
                  .then((response) => {
                    if (response.status === 200) {
                      setCurrent(response.data.current);
                      setPageSize(response.data.page_size);
                      setTotal(response.data.total);
                      setDataSource(response.data.data);
                      setCategory(1);
                    }
                  });
              } else { //查看下级分类
                setParentId(record.id);
                setCurrent(1);
                setPageSize(10);
                axios.post("/api1/admin/category/list", {
                  current: current,
                  parent_id: record.id,
                  page_size: pageSize,
                })
                  .then((response) => {
                    if (response.status === 200) {
                      setCurrent(response.data.current);
                      setPageSize(response.data.page_size);
                      setTotal(response.data.total);
                      setDataSource(response.data.data);
                      setCategory(2);
                    }
                  });
              }
            }}
          >
            {category === 1 ? "查看下级分类" : "返回上一级"}
          </Link>
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
                to={{ pathname: "/category/create", state: { data: record } }}
              >
                修改
              </Link>
            </Button>

            <Popconfirm
              title="确定要删除吗？"
              // onCancel={() => console.log('用户取消删除')}

              onConfirm={() => {
                axios
                  .post(`/api1/admin/category/delete`, { id: record.id })
                  .then(
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

  //初次渲染页面加载数据
  useEffect(() => {
    axios
      .post(`/api1/admin/category/list`, {
        current: current,
        page_size: pageSize,
        parent_id: 0,
      })
      .then(
        (res) => {
          setCurrent(res.data.current);
          setPageSize(res.data.page_size);
          setTotal(res.data.total);
          setDataSource(res.data.data);
          setLoading(true);
        },
        (err) => {
          localStorage.removeItem("token");
          props.history.push("/home/login");
        }
      );
  }, []);

  //翻页操作
  const changeHandler = (current, pageSize) => {
    setLoading(false);
    axios
      .post(`/api1/admin/category/list`, {
        current: current,
        page_size: pageSize,
        parent_id: parentId,
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
  };

  return loading ? (
    <Card
      title="分类列表"
      extra={
        <Button type="primary" size="small">
          <Link to={{ pathname: "/category/create", state: { data: "" } }}>
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
      title="商品列表"
      extra={
        <Button type="primary" size="small">
          <Link to={{ pathname: "/category/create", state: { data: "" } }}>
            新增
          </Link>
        </Button>
      }
    >
      <Loading />
    </Card>
  );
}

export default List;
