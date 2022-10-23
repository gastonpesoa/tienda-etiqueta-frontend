import { Button, Card, Row, Col, Image } from 'antd';
import Price from "./Price";
const { Meta } = Card;

const ProductSmallCard = ({ product }) => {
    return (
        <Card hoverable style={{ width: 330 }}>
            <Image
                alt={product.title}
                src={product.image}
                preview={false}
                style={{ marginBottom: '20px' }} />
            <Meta
                title={product.title}
                description={product.description}
                style={{ height: '80px' }}
            />
            <Row>
                <Col span={12}>
                    <Price price={product.price} type={'default'} level={5} style={{ marginTop: '10px' }} />
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Button type="primary" size='large'>Comprar</Button>
                </Col>
            </Row>
        </Card>
    );
}

export default ProductSmallCard;