import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import { Button, Card, Row, Col, Image, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Price from "./Price";
import Rating from './Rating';
const { Meta } = Card;
const { Title, Text } = Typography;

const ProductCard = ({ product }) => {

    return (
        <>
            <Link to={`../product-detail/${product.id}`}>
                <Card hoverable style={{ marginBottom: '32px' }}>
                    <Row gutter={16}>
                        <Col span={7}>
                            <Image
                                alt={product.title}
                                src={product.images[0]}
                                preview={false} />
                        </Col>
                        <Col span={10}>
                            <Title level={4}>{product.title}</Title>
                            <Row style={{ marginBottom: '10px' }}>
                                <Col span={24}>
                                    <Text level={5}>{product.description}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '30px' }} >
                                <Col span={24}>
                                    <Rating rating={product.rating} />
                                </Col>
                            </Row>
                            {
                                product.brand &&
                                <Row>
                                    <Col span={6}><Text type="secondary">Marca:</Text></Col>
                                    <Col span={18}><Text>{product.brand}</Text></Col>
                                </Row>
                            }
                            {
                                product.cut &&
                                <Row>
                                    <Col span={6}><Text type="secondary">Corte:</Text></Col>
                                    <Col span={18}><Text>{product.cut}</Text></Col>
                                </Row>
                            }
                            {
                                product.stock &&
                                <Row>
                                    <Col span={6}><Text type="secondary">Stock:</Text></Col>
                                    <Col span={18}><Text type="success">{product.stock}</Text></Col>
                                </Row>
                            }
                        </Col>
                        <Col span={7} style={{ textAlign: 'right' }}>
                            <Price price={product.price} type={'default'} level={4} style={{ marginBottom: '170px' }} />
                            <Button
                                type="primary"
                                size='large'
                                icon={<PlusOutlined />}
                            >Agregar al carrito</Button>
                        </Col>
                    </Row>
                </Card>
            </Link>
        </>
    );
}

export default ProductCard;