import { Space, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const LinksGroup = ({ title, items, buttonText }) => {
    return (
        <Space direction='vertical' >
            <Title level={4}>{title}</Title>
            {
                items.map(item => (
                    <Button type='link' style={{ padding: '0' }}>{item.title}</Button>
                ))
            }
            {
                buttonText &&
                <Button
                    size='large'
                    icon={<RightOutlined />}
                    style={{ marginTop: '25px' }}
                >
                    {buttonText}
                </Button>
            }
        </Space>
    );
}

export default LinksGroup;