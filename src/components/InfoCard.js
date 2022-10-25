import { Card, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import '../App.less';
const { Title, Text } = Typography;

const InfoCard = ({ title, subTitle, buttonText, backgroundImage }) => {
    return (
        <Card className='card-container'
            style={{
                position: 'relative',
                width: '95%',
                height: '300px',
                backgroundImage: `url(${process.env.PUBLIC_URL + backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right',
                backgroundColor: '#C8DEB3'
            }}
        >
            <Title level={5} style={{color:'#fff'}}>{subTitle}</Title>
            <Title level={3}>{title}</Title>
            <Button
                size='large'
                icon={<RightOutlined />}
                style={{ marginTop: '100px' }}
            >
                {buttonText}
            </Button>
        </Card>
    );
}

export default InfoCard;