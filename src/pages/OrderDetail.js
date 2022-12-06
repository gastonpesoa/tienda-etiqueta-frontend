import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Col, Row, Typography, List, Form, Input, Rate, Button, Divider, Skeleton, message, notification } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { formatState, formatDate } from '../Utils'
import Price from "../components/Price";
const { TextArea } = Input;
const { Title, Text } = Typography;

const OrderDetail = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const {
        id, date, state, last_update_date, items,
        card, billing, payment_method, delivery_method
    } = order;
    const [loading, setLoading] = useState(true);
    const [orderStateColor, setOrderStateColor] = useState('');
    const [orderStateText, setOrderStateText] = useState('');
    const [orderStateDescription, setOrderStateDescription] = useState('');
    const [showReview, setShowReview] = useState(false);
    const [productToReview, setProductToReview] = useState({});

    useEffect(() => {
        const getOrderById = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                })
                const data = await res.json();
                if (data.error) {
                    console.log("data.error", data.error)
                    message.error("Algo salió mal, por favor ingrese e inténtelo nuevamente")
                    navigate('/')
                    return
                }
                setOrder(data.data);
                setLoading(false);
            } catch (error) {
                alert(error)
            }
        }
        getOrderById(`${process.env.REACT_APP_API_URL_BASE}/orders/id/${orderId}`)
    }, [orderId])

    useEffect(() => {
        if (!state) {
            return
        }
        const user = JSON.parse(localStorage.getItem("user"))
        const { color, text, description } = formatState(state)
        setOrderStateColor(color)
        setOrderStateText(text)
        setOrderStateDescription(` - ${description} ${formatDate(last_update_date)}`)
        order.items.map(item => {
            item.reviewedByUser = item.product.reviews.some(review => review.user_id == user.id)
        })
    }, [order])

    const orderStateStyle = {
        color: orderStateColor
    }

    const handleSetShowReview = (item, product) => {
        if (!item.reviewedByUser) {
            setShowReview(true)
            setProductToReview(product)
        } else {
            message.error("Ya calificaste este producto!")
        }
    }

    const onFinish = (values) => {
        values.product_id = productToReview.id
        values.order_id = orderId
        console.log(values)
        registerReview(values)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        errorInfo.errorFields.map((e) => {
            openNotificationWithIcon(e.errors[0])
        })
    };

    const openNotificationWithIcon = (message) => {
        notification['error']({
            message: 'Cargue los datos necesarios',
            description: message,
        });
    };

    const registerReview = async (values) => {
        try {
            setLoading(true);
            let res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/review`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            let data = await res.json()
            setLoading(false);
            setShowReview(false)
            setProductToReview({})
            if (data.error) {
                message.error(data.message)
            } else {
                setOrder(data.data);
                message.success('Ya hemos registrado tu calificación. Gracias por tu dejarnos tu opinón!')
            }
        } catch (error) {
            console.log(error)
            message.error('No pudimos registrar tu opinón, intentalo nuevamente')
        }
    }

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : (<Row gutter={24}>
                        <Col span={14}>
                            <Row>
                                <Col span={24}>
                                    <Title level={2}>Información de la compra</Title>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Text strong style={orderStateStyle}>
                                        {orderStateText}
                                    </Text>
                                    <Text>{orderStateDescription}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '12px' }}>
                                <Col span={24}>
                                    <List
                                        itemLayout="vertical"
                                        size="large"
                                        pagination={false}
                                        dataSource={items}
                                        renderItem={(item) => (
                                            <List.Item
                                                style={{ padding: '12px 0' }}
                                                key={item._id}
                                                actions={[
                                                    <Button
                                                        disabled={item.reviewedByUser}
                                                        type="primary"
                                                        icon={<StarOutlined />}
                                                        onClick={() => handleSetShowReview(item, item.product)}
                                                    >
                                                        Calificar
                                                    </Button>
                                                ]}
                                                extra={
                                                    <img
                                                        width={160}
                                                        alt="logo"
                                                        src={item.product.images[0]}
                                                    />
                                                }
                                            >
                                                <Title level={5}>{item.product.title}</Title>
                                                <Row>
                                                    <Col span={8}><Text type="secondary">Marca:</Text></Col>
                                                    <Col span={16}><Text>{item.product.brand}</Text></Col>
                                                </Row>
                                                <Row>
                                                    <Col span={8}><Text type="secondary">Talle:</Text></Col>
                                                    <Col span={16}><Text>{item.product.articles[0].size}</Text></Col>
                                                </Row>
                                                <Row>
                                                    <Col span={8}><Text type="secondary">Unidades:</Text></Col>
                                                    <Col span={16}><Text>{item.units}</Text></Col>
                                                </Row>
                                                <Row>
                                                    <Col span={8}><Text type="secondary">Costo unitario:</Text></Col>
                                                    <Col span={16}> <Price price={item.product.price} level={5} /></Col>
                                                </Row>
                                            </List.Item>
                                        )}
                                    />
                                    <Divider />
                                    <Row>
                                        <Col span={24}>
                                            <Row>
                                                <Col span={12}>
                                                    <Text>Subtotal del pedido</Text>
                                                </Col>
                                                <Col span={12} style={{ textAlign: 'right' }}>
                                                    <Price price={billing.subtotal_cost} level={5} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            {
                                                delivery_method === 'Retiro en local'
                                                    ? <Row>
                                                        <Col span={12}>
                                                            <Text>Retiro en sucursal</Text>
                                                        </Col>
                                                        <Col span={12} style={{ textAlign: 'right' }}>
                                                            <Title level={5} type={'success'}>(Sin costo)</Title>
                                                        </Col>
                                                    </Row>
                                                    : <Row>
                                                        <Col span={12}>
                                                            <Text>{`Envío a ${billing.address}, ${billing.city} ${billing.province}`}</Text>
                                                        </Col>
                                                        <Col span={12} style={{ textAlign: 'right' }}>
                                                            <Price price={billing.shipping_cost} level={5} />
                                                        </Col>
                                                    </Row>
                                            }
                                        </Col>
                                    </Row>
                                    {
                                        billing.discount_code_amount &&
                                        <Row>
                                            <Col span={24}>
                                                <Row>
                                                    <Col span={12}>
                                                        <Text>Descuento por código promocional</Text>
                                                    </Col>
                                                    <Col span={12} style={{ textAlign: 'right' }}>
                                                        <Price style={{ color: '#FF0000' }} price={billing.discount_code_amount} level={5} />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    }
                                    {
                                        billing.discount_bank_amount &&
                                        <Row>
                                            <Col span={24}>
                                                <Row>
                                                    <Col span={12}>
                                                        <Text>Descuento por promoción bancaria</Text>
                                                    </Col>
                                                    <Col span={12} style={{ textAlign: 'right' }}>
                                                        <Price style={{ color: '#FF0000' }} price={billing.discount_bank_amount} level={5} />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    }
                                    <Divider />
                                    <Row>
                                        <Col span={24}>
                                            <Row>
                                                <Col span={12}>
                                                    <Title level={5}>Total del pedido</Title>
                                                </Col>
                                                <Col span={12} style={{ textAlign: 'right' }}>
                                                    <Price price={billing.total_cost} level={5} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    {

                                                        payment_method === 'Pago en el local'
                                                            ? <Text type="secondary">Pago en sucursal</Text>
                                                            : <Text type="secondary">
                                                                {`Pagado con tarjeta de crédito ${card.type} XXXX-XXXX-XXXX-${card.number.substr(card.number.length - 5)}`}
                                                            </Text>
                                                    }
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={10}>
                            {
                                showReview &&
                                <Form
                                    labelCol={{ span: 22 }}
                                    wrapperCol={{ span: 22 }}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    form={form}
                                >
                                    <Title level={2}>Calificación</Title>
                                    <Form.Item
                                        label={`Dejanos tu opinion sobre ${productToReview.title}:`}
                                        name="opinion"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Por favor ingresá tu opinión',
                                            },
                                        ]}
                                    >
                                        <TextArea rows={4} placeholder="Ingresá tu opinión..." />
                                    </Form.Item>
                                    <Form.Item
                                        label="Calificación:"
                                        name="rate"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Por favor calificá el producto',
                                            },
                                        ]}
                                    >
                                        <Rate />
                                    </Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size='large'
                                    >
                                        Calificar producto
                                    </Button>
                                </Form>
                            }
                        </Col>
                    </Row>)
            }
        </>
    )
}

export default OrderDetail