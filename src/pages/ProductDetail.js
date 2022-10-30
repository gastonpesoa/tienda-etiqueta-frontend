import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Col, Row, Typography, Image, Space } from 'antd';
import Price from "../components/Price";
import Rating from '../components/Rating';
import myData from '../data.json';
const { Title, Text } = Typography;

const ProductDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { trajes } = myData;
    const product = trajes[id - 1];

    return (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    {
                        product.images.map(image => (
                            <Row style={{ marginBottom: '30px' }}>
                                <Col span={24}>
                                    <Image src={image} />
                                </Col>
                            </Row>
                        ))
                    }
                </Col>
                <Col span={12}>
                    <Title>{product.title}</Title>
                    <Row style={{ marginBottom: '30px' }} >
                        {
                            product.rating_average &&
                            <Col span={6}>
                                <Rating rating={product.rating_average} color={'#FDBC15'} />
                            </Col>
                        }
                        {
                            product.reviews.length > 0 &&
                            <Col span={18}>
                                <Text type="secondary" underline>
                                    {`${product.reviews.length} opiniones de clientes`}
                                </Text>
                            </Col>
                        }
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Text level={5}>{product.description}</Text>
                        </Col>
                    </Row>
                    {
                        product.cut &&
                        <Row>
                            <Col span={24}><Text>{product.cut}</Text></Col>
                        </Row>
                    }
                    <Row gutter={16} style={{ marginTop: '30px' }}>
                        <Col span={12}>
                            <Row style={{ marginBottom: '10px' }}>
                                <Col span={6}><Text type="secondary">SKU:</Text></Col>
                                <Col span={18}><Text>{product.id}</Text></Col>
                            </Row>
                            {
                                product.category &&
                                <Row style={{ marginBottom: '10px' }}>
                                    <Col span={6}><Text type="secondary">Categoría:</Text></Col>
                                    <Col span={18}><Text>{product.category}</Text></Col>
                                </Row>
                            }
                            {
                                product.stock &&
                                <Row style={{ marginBottom: '10px' }}>
                                    <Col span={6}><Text type="secondary">Stock:</Text></Col>
                                    <Col span={18}>
                                        {
                                            product.stock > 0
                                                ? <Text type="success">En Stock</Text>
                                                : <Text type="danger">Sin Stock</Text>
                                        }
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
                        </Col>
                        <Col span={12}>

                            {
                                product.sizes &&
                                <Row>
                                    <Col span={24}><Text type="secondary">Talle:</Text></Col>
                                </Row>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default ProductDetail