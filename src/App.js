import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { Layout, message } from 'antd';
import { AppContext } from "./AppContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import OrderDetail from "./pages/OrderDetail";
import Error404 from "./pages/Error404";
import Checkout from "./pages/Checkout";
import CheckoutResult from "./pages/CheckoutResult";
import Banks from './pages/Banks';
import HeaderSearch from "./components/HeaderSearch";
import MenuHeader from "./components/MenuHeader";
import myData from './data.json';
import './App.less';
import { isExpired } from "react-jwt";
import OrderManagement from './pages/OrderManagement';
import OrderManagementDetail from './pages/OrderManagementDetail';
import UserManagement from './pages/UserManagement';
import ZoneManagement from './pages/ZoneManagement';
import DiscountCodeManagement from './pages/DiscountCodeManagement';
import CarouselManagement from './pages/CarouselManagement';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import SubcategoryManagement from './pages/SubcategoryManagement';
const { Header, Footer, Content } = Layout;

function App() {

  const { menu_employee, menu_client, menu_admin } = myData;

  const [token, setToken] = useState('');
  const [user, setUser] = useState({});
  const [shoppingCart, setShoppingCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
    let shoppingCartLocalStorage = localStorage.getItem("shoppingCart")
    let tokenStorage = localStorage.getItem("token")
    let userStorage = localStorage.getItem("user")
    if (shoppingCartLocalStorage?.length > 0) {
      setShoppingCart(JSON.parse(shoppingCartLocalStorage))
    }
    if (tokenStorage) {
      if (isExpired(tokenStorage)) {
        dispatchUserEvent('', {})
      }
      else {
        setToken(tokenStorage)
        if (userStorage) {
          setUser(JSON.parse(userStorage))
        }
      }
    }
  }, [])

  useEffect(() => {
    if (token === '') {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", token);
    }
    if (user.email) {
      localStorage.setItem("user", JSON.stringify(user));
      renderUserMenu()
    } else {
      localStorage.removeItem("user");
      setMenu([...categories, ...menu_client])
    }
  }, [user, token, categories])

  useEffect(() => {
    if (shoppingCart?.length > 0) {
      const result = shoppingCart.reduce((accumulator, item) => {
        return accumulator + (item.price * parseInt(item.unit));
      }, 0)
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
      setSubtotal(result)
    } else {
      localStorage.removeItem("shoppingCart");
      setSubtotal(0);
    }
  }, [shoppingCart])

  const dispatchUserEvent = (token, user) => {
    setToken(token)
    setUser(user)
  }

  const renderUserMenu = () => {
    if (user.type === "client") {
      setMenu([...categories, ...menu_client])
    }
    else if (user.type === "employee") {
      setMenu([...categories, ...menu_employee])
    }
    else if (user.type === "admin") {
      setMenu([...categories, ...menu_admin])
    }
  }

  const dispatchShoppingCartEvent = (actionType, payload) => {
    switch (actionType) {
      case 'ADD_ITEM':
        for (var i = 0; i < shoppingCart.length; i++) {
          if (shoppingCart[i].sku === payload.newItem.sku) {
            message.error(`Ya agregaste este artículo al carrito`)
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
        let filteredShoppingCart = shoppingCart.filter(item => item.sku !== payload.itemSku)
        setShoppingCart(filteredShoppingCart);
        message.success("Producto removido del carrito")
        return;
      case 'REMOVE_ALL':
        setShoppingCart([]);
        return;
      default:
        return;
    }
  }

  const getCategories = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/categories/subcategories`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      })
      const data = await res.json();
      let newArray = []
      data.data.map(item => {
        newArray.push({
          key: item._id,
          title: item.name,
          link: `/products/${item.url}`,
          items: [...item.items]
        })
      })
      setCategories(newArray);
    } catch (error) {
      message.error(error)
      console.log(error)
    }
  }

  return (
    <>
      <Layout id="page-container" className="layout">
        <div className="logo" />
        <AppContext.Provider value={{ token, user, shoppingCart, subtotal, dispatchUserEvent, dispatchShoppingCartEvent }}>
          <HeaderSearch />
          <Header>

            <MenuHeader menu={menu} />

          </Header>
          <Content>
            <div id="content-wrap" className="site-layout-content">
              <Routes>
                <Route path="/" element={<Home menu={menu} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/products/:category/" element={<Products />} />
                <Route path="/products/:category/:subcategory" element={<Products />} />
                <Route path="/products-search/:query" element={<Products />} />
                <Route path="/product-detail/:productId" element={<ProductDetail />} />
                <Route path="/product-management" element={<ProductManagement />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/result/:orderId" element={<CheckoutResult />} />
                <Route path="/order-detail/:orderId" element={<OrderDetail />} />
                <Route path="/order-management" element={<OrderManagement />} />
                <Route path="/order-management-detail/:orderId" element={<OrderManagementDetail />} />
                <Route path="/users-management" element={<UserManagement />} />
                <Route path="/zones-management" element={<ZoneManagement />} />
                <Route path="/discounts-management" element={<DiscountCodeManagement />} />
                <Route path="/categories-management" element={<CategoryManagement />} />
                <Route path="/subcategories-management" element={<SubcategoryManagement />} />
                <Route path="/carousel-management" element={<CarouselManagement />} />
                <Route path="/banks" element={<Banks />} />
                <Route path="*" element={<Error404 />} />
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
