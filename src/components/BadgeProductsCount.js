import { Badge, Space, Typography } from 'antd';
const { Title, Text } = Typography;

const BadgeProductsCount = ({ count }) => {
    return (
        <>
            <Space>
                <Badge style={{ color: '#6A983C', backgroundColor: '#F4F8EC' }} count={count} />
                <Text>Productos</Text>
            </Space>
        </>
    );
}

export default BadgeProductsCount;