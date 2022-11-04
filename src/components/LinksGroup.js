import { Link } from "react-router-dom";
import { Space, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
const { Title } = Typography;

const LinksGroup = ({ title, items, buttonText }) => {
    return (
        <Space direction='vertical' >
            <Title level={4}>{title}</Title>
            {
                items.map((item, i) => (
                    <Link key={i} to={item.link}>
                        <Button type='link' style={{ padding: '0' }}>{item.title}</Button>
                    </Link>
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