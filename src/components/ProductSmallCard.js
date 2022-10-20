import { Space, Typography, Button, Card } from 'antd';
import { RightOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const { Meta } = Card;

const ProductSmallCard = ({ product }) => {
    console.log("product", product)
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
                <Title level={4}>{`$${parseFloat(product.price).toFixed(2)}`}</Title>
                <Button type="primary" size='large'>Comprar</Button>
            </Space>
        </Card>
    );
}

export default ProductSmallCard;