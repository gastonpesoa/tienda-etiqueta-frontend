import { Col, Row, Image, Button } from 'antd';
import Search from "./Search";
import ShoppingCartPopover from "./ShoppingCartPopover";
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'

const HeaderSearch = () => {

    const navigate = useNavigate()

    const handleGoHome = () => {
        navigate('/')
    }

    const handleActionUser = () => {
        let token = localStorage.getItem("token")
        if (!token) {
            navigate('/login')
        } else {
            navigate('/user-profile')
        }
    }

    return (
        <Row className='header-row-container'>
            <Col className='logo-container' span={2}>
                <Image
                    src={process.env.PUBLIC_URL + '/logo.png'}
                    alt="Logo"
                    className="logo"
                    preview={false}
                    onClick={handleGoHome}
                    style={{ cursor: 'pointer' }}
                />
            </Col>
            <Col className='header-col-container' span={20}>
                <Search />
            </Col>
            <Col className='header-col-container' span={1}>
                <Button
                    onClick={handleActionUser}
                    type='link'
                    icon={<UserOutlined style={{ fontSize: '24px', color: 'black' }} />}
                />
            </Col>
            <Col className='header-col-container' span={1}>
                <ShoppingCartPopover />
            </Col>
        </Row>
    )
};

export default HeaderSearch;