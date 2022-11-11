import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
const { Title, Text } = Typography;

const UserProfile = () => {

    const { user, dispatchUserEvent } = useContext(AppContext);
    const navigate = useNavigate()

    const handleClseSesion = () => {
        dispatchUserEvent('', {})
        navigate('/')
    }

    return (
        <>
            <Row>
                <Col span={12}><Title>Hola {user.name}!</Title></Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Button
                        onClick={handleClseSesion}
                        type='link'
                        icon={<LogoutOutlined style={{ fontSize: '24px', color: 'black' }} />}
                    >
                        Cerrar sesión
                    </Button>
                </Col>
            </Row>
        </>
    )
}

export default UserProfile