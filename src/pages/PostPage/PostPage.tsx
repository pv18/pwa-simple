import React, { useEffect, useState } from 'react';
import { BaseLayout } from 'components';
import { IPost, postAPI } from 'api';
import type { ColumnsType } from 'antd/es/table';
import { Spin, Table } from 'antd';

export const PostPage = () => {
  const [posts, setPosts] = useState<IPost[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    try {
      setLoading(true);
      const { data } = await postAPI.getPosts();
      if (data) {
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnsType<IPost> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Body',
      dataIndex: 'body',
    },
  ];

  return (
    <BaseLayout>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={posts?.map((item) => ({ ...item, key: item.id }))}
        />
      </Spin>
    </BaseLayout>
  );
};
