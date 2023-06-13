import React from 'react';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const Navigation: React.FC<{ children: any }> = ({ children }) => {

  return (
    <Layout>
      <Header
        style={{
          textAlign: 'center',
          color: '#fff',
          height: 64,
          paddingInline: 50,
          lineHeight: '64px',
          backgroundColor: '#7dbcea',
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={new Array(3).fill(null).map((_, index) => ({
            key: String(index + 1),
            label: `nav ${index + 1}`,
          }))}
        />
      </Header>
      { children }
    </Layout>
  );
};
  
export default Navigation;