import { Card, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const InfoCard = ({ title, subTitle, buttonText }) => {
    return (
        <Card
            style={{
                width: '100%',
                background: '#C8DEB3'
            }}
        >
            <Title level={5} type="success">{subTitle}</Title>
            <Title level={3}>{title}</Title>
            <Button
                size='large'
                icon={<RightOutlined />}
                style={{ marginTop: '25px' }}
            >
                {buttonText}
            </Button>
        </Card>
    );
}

export default InfoCard;