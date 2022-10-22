import { Col, Row, Image, Button } from 'antd';
import logo from "../logo.png"
import Search from "./Search";
import ShoppingCartPopover from "./ShoppingCartPopover";
import { UserOutlined } from '@ant-design/icons';

const HeaderSearch = ({ shoppingCartItems }) => {
    return (
        <Row className='header-row-container'>
            <Col className='logo-container' span={2}>
                <Image src={logo} alt="Logo" className="logo" preview={false} />
            </Col>
            <Col className='header-col-container' span={20}>
                <Search />
            </Col>
            <Col className='header-col-container' span={1}>
                <Button
                    type='link'
                    style={{ padding: '0' }}
                    icon={<UserOutlined style={{ fontSize: '24px', color: 'black' }} />}
                />
            </Col>
            <Col className='header-col-container' span={1}>
                <ShoppingCartPopover items={shoppingCartItems} />
            </Col>
        </Row>
    )
};

export default HeaderSearch;