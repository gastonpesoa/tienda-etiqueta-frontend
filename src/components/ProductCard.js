import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import { Button, Card, Row, Col, Image, Typography, Space, Rate } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Price from "./Price";
const { Meta } = Card;
const { Title, Text } = Typography;

const ProductCard = ({ product }) => {

    return (
        <>
            <Link to={`../product-detail/${product._id}`}>
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
                            {
                                product.rating_average > 0 &&
                                <Row style={{ marginBottom: '30px' }} >
                                    <Col span={24}>
                                        <Rate
                                            allowHalf
                                            style={{ color: "black" }}
                                            defaultValue={product.rating_average}
                                            disabled
                                        />
                                    </Col>
                                </Row>
                            }
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
                        </Col>
                        <Col span={7} style={{ textAlign: 'right' }}>
                            <Price price={product.price} type={'default'} level={4} style={{ marginBottom: '170px' }} />
                        </Col>
                    </Row>
                </Card>
            </Link>
        </>
    );
}

export default ProductCard;