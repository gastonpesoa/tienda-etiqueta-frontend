import { Badge, Popover, Col, Row, Space, Button, Typography, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
const { Title, Text } = Typography;

const popoverContent = (
    <Space direction='vertical'>
        <Button>Ingresá</Button>
        <Button>Tu cuenta</Button>
        <Button>Creá tu cuenta</Button>
    </Space>
)

const ActionsUser = () => {
    return (
        <Popover content={popoverContent} placement='bottomRight'>
            <UserOutlined style={{ fontSize: '24px' }} />
        </Popover>
    );
}

export default ActionsUser;