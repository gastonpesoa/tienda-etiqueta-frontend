import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { Layout, message } from 'antd';
import { AppContext } from "./AppContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Eror404 from "./pages/Eror404";
import Checkout from "./pages/Checkout";
import HeaderSearch from "./components/HeaderSearch";
import MenuHeader from "./components/MenuHeader";
import './App.less';
import myData from './data.json';
const { Header, Footer, Content } = Layout;

function App() {

  const { menu, carousel_source, best_sellers, best_suits, current_promotions } = myData;

  const [shoppingCart, setShoppingCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const result = shoppingCart.reduce((accumulator, item) => {
      return accumulator + (item.price * parseInt(item.unit));
    }, 0)
    setSubtotal(result)
  }, [shoppingCart])

  const dispatchShoppingCartEvent = (actionType, payload) => {
    switch (actionType) {
      case 'ADD_ITEM':
        for (var i = 0; i < shoppingCart.length; i++) {
          if (shoppingCart[i].id === payload.newItem.id) {
            message.error(`Ya agregaste ${payload.newItem.title} al carrito`)
            return;
          }
        }
        setShoppingCart([...shoppingCart, payload.newItem])
        message.success(`Agregaste ${payload.newItem.unit} ${payload.newItem.unit > 1 ? 'unidades' : 'unidad'} de ${payload.newItem.title} al carrito`)
        return;
      case 'UPDATE_ITEM':
        let index = shoppingCart.indexOf(payload.itemToUpdate)
        let newArr = [...shoppingCart]
        newArr[index] = payload.itemUpdated
        setShoppingCart(newArr)
        return;
      case 'REMOVE_ITEM':
        setShoppingCart(shoppingCart.filter(item => item.id !== payload.itemId));
        message.success("Producto removido del carrito")
        return;
      default:
        return;
    }
  }

  return (
    <>
      <Layout id="page-container" className="layout">
        <div className="logo" />
        <AppContext.Provider value={{ shoppingCart, subtotal, dispatchShoppingCartEvent }}>
          <HeaderSearch />
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
                <Route path="/products/:category/" element={<Products />} />
                <Route path="/products/:category/:subcategory" element={<Products />} />
                <Route path="/product-detail/:productId" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<Eror404 />} />
              </Routes>

            </div>
          </Content>
        </AppContext.Provider>
        <Footer id="footer" style={{ position: "unset" }}>
          Copyright © 2022 | Tienda Etiqueta
        </Footer>
      </Layout>
    </>
  );
}

export default App;
