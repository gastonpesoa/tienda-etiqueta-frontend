import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import HeaderSearch from "./components/HeaderSearch";
import MenuHeader from "./components/MenuHeader";
import './App.less';
import { Breadcrumb, Layout, Menu } from 'antd';
import myData from './data.json';
const { Header, Footer, Content } = Layout;

function App() {
  const { shoppingCartItems, menu, carouselSource, bestSellers, bestSuits } = myData;
  return (
    <Layout className="layout">
      <div className="logo" />
      <HeaderSearch shoppingCartItems={shoppingCartItems}></HeaderSearch>
      <Header>
        <MenuHeader menu={menu} />
      </Header>
      <Content>
        <div className="site-layout-content">
          <Routes>
            <Route path="/" element={
              <Home
                carouselSource={carouselSource}
                bestSellers={bestSellers}
                bestSuits={bestSuits}
              />
            }
            />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Copyright © 2022 | Tienda Etiqueta
      </Footer>
    </Layout>
  );
}

export default App;
