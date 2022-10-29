import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trajes from "./pages/Trajes";
import ProductDetail from "./pages/ProductDetail";
import Eror404 from "./pages/Eror404";
import HeaderSearch from "./components/HeaderSearch";
import MenuHeader from "./components/MenuHeader";
import './App.less';
import { Breadcrumb, Layout, Menu } from 'antd';
import myData from './data.json';
const { Header, Footer, Content } = Layout;

function App() {
  const { shopping_cart_items, menu, carousel_source, best_sellers, best_suits } = myData;
  return (
    <>
      <Layout id="page-container" className="layout">
        <div className="logo" />
        <HeaderSearch shoppingCartItems={shopping_cart_items}></HeaderSearch>
        <Header>
          <MenuHeader menu={menu} />
        </Header>
        <Content>
          <div id="content-wrap" className="site-layout-content">
            <Routes>
              <Route path="/" element={
                <Home
                  carouselSource={carousel_source}
                  bestSellers={best_sellers}
                  bestSuits={best_suits}
                />
              }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/trajes" element={<Trajes />} />
              <Route path="/trajes/:id" element={<ProductDetail />} />
              <Route path="*" element={<Eror404 />} />
            </Routes>
          </div>
        </Content>
        <Footer id="footer">
          Copyright © 2022 | Tienda Etiqueta
        </Footer>
      </Layout>
    </>
  );
}

export default App;
