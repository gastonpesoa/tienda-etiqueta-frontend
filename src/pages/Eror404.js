import { Typography } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const Error404 = () => {
    return (
        <>
            <Title>
                Página no encontrada <FrownOutlined />
            </Title>
        </>
    )
}

export default Error404