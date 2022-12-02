import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Col, Row, Typography, Image, Space, Radio, Card, Button, Tabs, Badge, Table, Divider, Skeleton, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
import Price from "../components/Price";
import UnitsSelect from "../components/UnitsSelect";
import Rating from '../components/Rating';
import myData from '../data.json';
const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {

    const { productId } = useParams();
    const navigate = useNavigate();
    const { dispatchShoppingCartEvent } = useContext(AppContext);
    const [product, setProduct] = useState({});
    const { id, category, title, description, detail, images,
        brand, color, cut, price,
        rating_average, reviews, articles
    } = product;
    const [loading, setLoading] = useState(true);
    const [unit, setUnit] = useState("1");
    const [article, setArticle] = useState([]);
    const [tabs, setTabs] = useState([]);
    const { sizes_list } = myData;

    useEffect(() => {
        const getProductById = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url)
                const data = await res.json();
                setProduct(data.data);
                setArticle(data.data.articles[0])
                let descriptionTab = {
                    label: <Text>Descripción</Text>,
                    key: 'description',
                    children:
                        <>
                            <Title level={5} style={{ marginTop: '40px', marginBottom: '20px' }}>Detalle</Title>
                            <Paragraph>
                                {data.data.detail}
                            </Paragraph>
                            <Title level={5} style={{ marginTop: '40px', marginBottom: '20px' }}>Listado de talles</Title>
                            <Table dataSource={sizes_list} columns={columns} pagination={false} />
                        </>
                }
                let reiviewsTab = {
                    label:
                        <Space>
                            <Text>Opiniones</Text>
                            <Badge style={{ color: '#6A983C', backgroundColor: '#F4F8EC' }} count={data.data.reviews.length} />
                        </Space>,
                    key: 'reviews',
                    children:
                        <>
                            <Title level={5} style={{ marginTop: '40px', marginBottom: '20px' }}>Opiniones del producto</Title>
                            {
                                data.data.reviews.map((review, i) => (
                                    <div key={i} style={{ marginTop: '50px' }} >
                                        <Rating rating={review.rating} />
                                        <Paragraph>
                                            {review.review}
                                        </Paragraph>
                                        <Divider />
                                    </div>
                                ))
                            }
                        </>
                }

                if (data.data.reviews.length > 0) {
                    setTabs([descriptionTab, reiviewsTab])
                } else {
                    setTabs([descriptionTab])
                }
                setLoading(false);
            } catch (error) {
                message.error('Ha ocurrido un error, inténtalo nuevamente')
                console.log(error)
                navigate("/")
            }
        }
        getProductById(`${process.env.REACT_APP_API_URL_BASE}/products/${productId}`)
    }, [productId])

    const changeUnitsState = (value) => {
        setUnit(value)
    }

    const onSizeChange = (e) => {
        console.log(e.target.value)
        let articleSelected = articles.find(x => x.sku === e.target.value);
        setArticle(articleSelected)
        setUnit("1")
    };

    const handleClickAddToShoppingCart = () => {
        let productToAdd = {
            id: id,
            sku: article.sku,
            title: title,
            brand: brand,
            size: article.size,
            color: color,
            price: price,
            rating_average: rating_average,
            unit: unit,
            units: article.stock,
            image: images[0]
        }
        dispatchShoppingCartEvent('ADD_ITEM', { newItem: productToAdd });
    }

    const columns = [
        {
            title: 'Talle',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Pecho',
            dataIndex: 'chest',
            key: 'chest',
        },
        {
            title: 'Cintura',
            dataIndex: 'waist',
            key: 'waist',
        },
    ];

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : (<Row gutter={16}>
                        <Col span={12}>
                            {
                                product.images.map((image, i) => (
                                    <Row key={i} style={{ marginBottom: '30px' }}>
                                        <Col span={24}>
                                            <Image src={image} />
                                        </Col>
                                    </Row>
                                ))
                            }
                        </Col>
                        <Col span={12}>
                            <Title>{title}</Title>
                            {
                                reviews.length > 0 &&
                                <Row style={{ marginBottom: '30px' }} >
                                    <Col span={6}>
                                        <Rating rating={rating_average} color={'#FDBC15'} />
                                    </Col>
                                    <Col span={18}>
                                        <Text type="secondary" underline>
                                            {`${reviews.length} opiniones de clientes`}
                                        </Text>
                                    </Col>
                                </Row>
                            }
                            <Row>
                                <Col span={24}>
                                    <Text level={5}>{description}</Text>
                                </Col>
                            </Row>
                            {
                                cut &&
                                <Row>
                                    <Col span={24}><Text>{cut}</Text></Col>
                                </Row>
                            }
                            <Row gutter={16} style={{ margin: '30px 0px' }}>
                                <Col span={12}>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <Col span={6}><Text type="secondary">SKU:</Text></Col>
                                        <Col span={18}><Text>{article.sku}</Text></Col>
                                    </Row>
                                    {
                                        category &&
                                        <Row style={{ marginBottom: '10px' }}>
                                            <Col span={6}><Text type="secondary">Categoría:</Text></Col>
                                            <Col span={18}><Text>{category.name}</Text></Col>
                                        </Row>
                                    }
                                    {
                                        article.stock &&
                                        <Row style={{ marginBottom: '10px' }}>
                                            <Col span={6}><Text type="secondary">Stock:</Text></Col>
                                            <Col span={18}>
                                                {
                                                    article.stock
                                                    // > 0
                                                    //     ? <Text type="success">En Stock</Text>
                                                    //     : <Text type="danger">Sin Stock</Text>
                                                }
                                            </Col>
                                        </Row>
                                    }
                                    {
                                        brand &&
                                        <Row>
                                            <Col span={6}><Text type="secondary">Marca:</Text></Col>
                                            <Col span={18}><Text>{brand}</Text></Col>
                                        </Row>
                                    }
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={24}><Text type="secondary">Talle:</Text></Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Radio.Group onChange={onSizeChange} value={article.sku}>
                                                {
                                                    articles.map((item, i) => (
                                                        <Radio key={i} value={item.sku}>{item.size}</Radio>
                                                    ))
                                                }
                                            </Radio.Group>
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '60px' }}>
                                <Col span={24}>
                                    <Card>
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Price price={price} level={3} type={"success"} />
                                            </Col>
                                            <Col span={8}>
                                                <UnitsSelect units={article.stock} unit={unit} setUnit={changeUnitsState} size={'large'} />
                                            </Col>
                                            <Col span={8}>
                                                <Button
                                                    type="primary"
                                                    size='large'
                                                    icon={<PlusOutlined />}
                                                    onClick={handleClickAddToShoppingCart}
                                                >Agregar al carrito</Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Tabs items={tabs} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>)
            }
        </>
    )
}

export default ProductDetail