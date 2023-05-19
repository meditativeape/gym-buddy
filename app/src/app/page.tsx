'use client';

import React, { useState } from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Breadcrumb, Divider, Layout, List, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const workouts = [
  {
    'id': 1,
    'title': "Leg Day",
    'data': [
      'Squats, 150lbs, 3 sets of 8',
      'Deadlift, 145lbs, 3 sets of 5',
    ],
  },
  {
    'id': 2,
    'title': "Bench Day",
    'data': [
      'Chest Press, 90lbs, 3 sets of 6',
      'Single-arm DB row, 32.5lbs, 3 sets of 10',
    ],
  },
];

const WorkoutDetail: React.FC<any> = ({ title, data }) => {
  return (
    <div>
      <Divider orientation="left">{title}</Divider>
      <List
        bordered
        dataSource={data}
        renderItem={(item: string) => <List.Item>{item}</List.Item>}
      />
    </div>
  );
};

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
            (icon, index) => ({
              key: String(index + 1),
              icon: React.createElement(icon),
              label: `nav ${index + 1}`,
            }),
          )}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content className="site-layout" style={{ padding: '0 50px' }}>
          <Breadcrumb items={[{ title: 'All Workouts' }, { title: 'Today\'s Workout' }]} />
          <div style={{ padding: 24, minHeight: 720, background: colorBgContainer, color: 'black'}}>
            {workouts.map((session) => <WorkoutDetail key={session.id} {...session} />)}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

// export default function App() {
//   const [useNarrowLayout, setUseNarrowLayout] = useState(false);

//   const checkWindowSize = () => {
//     console.log('triggered');
//     if (window.innerWidth < 768) {
//       console.log('narrow');
//       setUseNarrowLayout(true);
//     } else {
//       setUseNarrowLayout(false);
//     }
//   };

//   useEffect(() => {
//     checkWindowSize();
//     window.addEventListener('resize', checkWindowSize);
//     return () => {
//       window.removeEventListener('resize', checkWindowSize);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col md:flex-row">
//       {!useNarrowLayout && (
//         <div className="fixed inset-0 flex-none md:relative md:w-64 bg-black text-white" style={{ width: '200px' }}>
//           This is the side bar!
//         </div>
//       )}
//       <div className="flex-1 bg-gray-300" style={{ marginLeft: useNarrowLayout ? '200px' : '0' }}>
//         {useNarrowLayout && (
//           <div className="w-full bg-gray-200">
//             <button>Toggle Sidebar</button>
//           </div>
//         )}
//         This is the main content!
//       </div>
//     </div>
//   );
// }

export default App;
