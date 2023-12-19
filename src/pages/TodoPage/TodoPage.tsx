import React, { useEffect, useState } from 'react';
import { BaseLayout } from 'components';
import { ITodo, todoAPI } from 'api';
import { ColumnsType } from 'antd/es/table';
import { Spin, Table } from 'antd';

export const TodoPage = () => {
  const [todos, setTodos] = useState<ITodo[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    try {
      setLoading(true);
      const { data } = await todoAPI.getTodos();
      if (data) {
        setTodos(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnsType<ITodo> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      render: (value) => `${value}`,
    },
  ];

  return (
    <BaseLayout>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={todos?.map((item) => ({ ...item, key: item.id }))}
        />
      </Spin>
    </BaseLayout>
  );
};
