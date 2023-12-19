import React, { FC } from 'react';
import { Layout, Menu, theme } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from 'enums';

const { Header, Content, Footer } = Layout;

const items = ['HOME', 'POST', 'TODO'].map((item) => ({
  key: item,
  label: item,
}));

interface BaseLayoutProps {
  children?: React.ReactNode;
}

export const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  let defaultSelectedKeys = 'HOME';
  if (location.pathname === '/todo') defaultSelectedKeys = 'TODO';
  if (location.pathname === '/post') defaultSelectedKeys = 'POST';

  const handleClick = (item: ItemType) => {
    let route = ROUTES.HOME;
    if (item && item.key === 'POST') route = ROUTES.POST;
    if (item && item.key === 'TODO') route = ROUTES.TODO;
    navigate(`${route}`);
  };

  return (
    <Layout
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className='demo-logo' />
        <Menu
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={[defaultSelectedKeys]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
          onClick={(item) => handleClick(item)}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div
          style={{
            marginTop: 16,
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ marginTop: 'auto', textAlign: 'center' }}>
        PWA simple
      </Footer>
    </Layout>
  );
};
