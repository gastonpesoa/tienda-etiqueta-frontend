import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import HeaderSearch from "./components/HeaderSearch";
import MenuHeader from "./components/MenuHeader";
import './App.less';
import { Breadcrumb, Layout, Menu } from 'antd';
import myData from './data.json';
const { Header, Footer, Content } = Layout;

function App() {
  const { shoppingCartItems, menu } = myData;
  return (
    <Layout className="layout">
      <div className="logo" />
      <HeaderSearch shoppingCartItems={shoppingCartItems}></HeaderSearch>
      <Header>
        <MenuHeader menu={menu} />
      </Header>
      <Content
        style={{
          padding: '0 50px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default App;
