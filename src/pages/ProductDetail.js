import { useState } from 'react';
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Col, Row, Typography, Image, Space, Radio, Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Price from "../components/Price";
import UnitsSelect from "../components/UnitsSelect";
import Rating from '../components/Rating';
import myData from '../data.json';
const { Title, Text } = Typography;

const ProductDetail = () => {

    const { trajes } = myData;
    const product = trajes[id - 1];

    const tabs = [
        { label: 'Descripción', key: 'item-1', children: 'Content 1' },
        { label: 'Opiniones', key: 'item-2', children: 'Content 2' },
      ];

    const { id } = useParams();
    const navigate = useNavigate();
    const [unit, setUnit] = useState(1);
    
    const onSizeChange = (e) => {
        console.log('radio checked', e.target.value);
    };
    
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
                    <Row gutter={16} style={{ margin: '30px 0px' }}>
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
                                            product.stock
                                            // > 0
                                            //     ? <Text type="success">En Stock</Text>
                                            //     : <Text type="danger">Sin Stock</Text>
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
                                <>
                                    <Row>
                                        <Col span={24}><Text type="secondary">Talle:</Text></Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Radio.Group onChange={onSizeChange}>
                                                {
                                                    product.sizes.map(size => (
                                                        <Radio value={size}>{size}</Radio>
                                                    ))
                                                }
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                </>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Card>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Price price={product.price} level={3} type={"success"} />
                                    </Col>
                                    <Col span={8}>
                                        <UnitsSelect units={product.stock} setUnit={setUnit} size={'large'} />
                                    </Col>
                                    <Col span={8}>
                                        <Button
                                            type="primary"
                                            size='large'
                                            icon={<PlusOutlined />}
                                        >Agregar al carrito</Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default ProductDetail