import { Space, Typography, Button, Card, Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Price from "./Price";
const { Title, Text } = Typography;
const { Meta } = Card;

const ProductSmallCard = ({ product }) => {
    return (
        <Card
            hoverable
            style={{
                width: 240,
            }}
            cover={<img alt={product.title} src={product.image} />}
        >
            <Meta
                title={product.title}
                description={product.description}
                style={{ height: '100px' }}
            />
            <Space>
                <Price price={product.price} type={'default'} level={5} style={{ marginTop: '10px' }} />
                <Button type="primary" size='large'>Comprar</Button>
            </Space>
        </Card>
    );
}

export default ProductSmallCard;