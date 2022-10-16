import { Col, Row } from 'antd';
import logo from "../logo.png"
import Search from "./Search";
import ActionsUser from "./ActionsUser";
import ShoppingCart from "./ShoppingCart";

const HeaderSearch = () => {
    return (
        <Row className='header-row-container'>
            <Col className='logo-container' span={2}>
                <img src={logo} alt="Logo" className="logo"/>
            </Col>
            <Col className='header-col-container'span={20}>
                <Search/>
            </Col>
            <Col className='header-col-container' span={1}>
                <ActionsUser/>
            </Col>
            <Col className='header-col-container' span={1}>
                <ShoppingCart/>
            </Col>
        </Row>
    )
};

export default HeaderSearch;