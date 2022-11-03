import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Eror404 from "./pages/Eror404";
import Checkout from "./pages/Checkout";
import HeaderSearch from "./components/HeaderSearch";
import MenuHeader from "./components/MenuHeader";
import './App.less';
import { Breadcrumb, Layout, Menu } from 'antd';
import myData from './data.json';
const { Header, Footer, Content } = Layout;

function App() {
  const { shopping_cart_items, menu, carousel_source, best_sellers, best_suits, current_promotions } = myData;
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
                  menu={menu}
                  currentPromotions={current_promotions}
                />
              }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/category/:idCategory" element={<Category />} />
              <Route path="/product-detail/:idProduct" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
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
