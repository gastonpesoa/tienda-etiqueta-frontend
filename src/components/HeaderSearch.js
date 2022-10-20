import { Col, Row, Image } from 'antd';
import logo from "../logo.png"
import Search from "./Search";
import ActionsUser from "./ActionsUser";
import ShoppingCartPopover from "./ShoppingCartPopover";

const HeaderSearch = ({ shoppingCartItems }) => {
    return (
        <Row className='header-row-container'>
            <Col className='logo-container' span={2}>
                <Image src={logo} alt="Logo" className="logo" preview={false}/>
            </Col>
            <Col className='header-col-container' span={20}>
                <Search />
            </Col>
            <Col className='header-col-container' span={1}>
                <ActionsUser />
            </Col>
            <Col className='header-col-container' span={1}>
                <ShoppingCartPopover items={shoppingCartItems} />
            </Col>
        </Row>
    )
};

export default HeaderSearch;