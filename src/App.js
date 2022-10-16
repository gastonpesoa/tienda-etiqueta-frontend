import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import HeaderSearch from "./components/HeaderSearch";
import './App.less';
import { Breadcrumb, Layout, Menu } from 'antd';
const { Header, Footer, Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <div className="logo" />
      <HeaderSearch></HeaderSearch>
      <Header>
        <Menu theme="light" mode="horizontal" style={{ background: '#F9F9F9' }}>
          <Menu.SubMenu key="ambos" title="Ambos">
            <Menu.Item key="ambos-slim">
              Slim
            </Menu.Item>
            <Menu.Item key="ambos-slim-fit">
              Slim fit
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="trajes" title="Trajes">
            <Menu.Item key="trajes-negros">
              Trajes Negros
            </Menu.Item>
            <Menu.Item key="trajes-azules">
              Trajes azules
            </Menu.Item>
            <Menu.Item key="trajes-blancos">
              Trajes blancos
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="camisas" title="Camisas">
            <Menu.Item key="camisas-lisas">
              Camisas Lisas
            </Menu.Item>
            <Menu.Item key="camisas-rayadas">
              Camisas Rayadas
            </Menu.Item>
            <Menu.Item key="camisas-estampadas">
              Camisas Estampadas
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="zapatos">
            Zapatos
          </Menu.Item>
          <Menu.Item key="corbatas">
            Corbatas
          </Menu.Item>
          <Menu.Item key="accesorios">
            Accesorios
          </Menu.Item>
        </Menu>
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
