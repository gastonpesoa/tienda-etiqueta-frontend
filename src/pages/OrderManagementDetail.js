import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import { Col, Row, Typography, List, Form, Input, Rate, Button, Divider, Skeleton, message, notification } from 'antd';
import { formatState, formatDate } from '../Utils'
import Price from "../components/Price";
const { Title, Text } = Typography;

const OrderManagementDetail = () => {

    const navigate = useNavigate();
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

    useEffect(() => {
        const getOrderById = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                })
                const data = await res.json();
                if (data.error) {
                    console.log("data.error", data.error);
                    message.error("Algo salió mal, por favor ingrese e inténtelo nuevamente");
                    navigate('/order-management');
                    return;
                }
                else if (data.data === "Order not found") {
                    message.error("La orden solicitada no fue encontrada, por favor inténtelo nuevamente");
                    navigate('/order-management');
                    return;
                }
                setOrder(data.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                message.error("Algo salió mal, por favor ingrese e inténtelo nuevamente");
                navigate('/order-management');
            }
        }
        getOrderById(`${process.env.REACT_APP_API_URL_BASE}/orders/id/${orderId}`);
    }, [orderId]);

    useEffect(() => {
        if (!state) {
            return
        }
        let { color, text, description_seller } = formatState(state)
        setOrderStateColor(color)
        setOrderStateText(text)
        setOrderStateDescription(` - ${description_seller} ${formatDate(last_update_date)}`)
    }, [order])

    const handleChangeState = (state) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/orders/state/${orderId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ state })
            })
            .then((res) => {
                message.success('Estado de la orden modificado con éxito!');
                return res.ok ? res.json() : Promise.reject(res)
            })
            .then((orderEdited) => {
                setOrder(orderEdited);
            })
            .catch((err) => {
                console.error(err);
                message.error("Hubo un error al intentar modificar el estado de esta orden, intente nuevamente más tarde");
            });
    }

    const orderStateStyle = {
        color: orderStateColor
    }

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : (<>
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
                        <Row gutter={24}>
                            <Col span={14}>
                                
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
                                                    key={item.product.id}
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
                                                        <Col span={16}><Text>{item.size}</Text></Col>
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
                                <Row style={{ marginTop: '12px' }}>
                                    <Col span={24} style={{ paddingTop: '12px' }}>
                                        {
                                            delivery_method === 'Envío a domicilio' && state === 'CONFIRMADA' &&
                                            <Button style={{ marginBottom: '10px', display: 'block', width: '100%' }} type="primary" htmlType="submit" size='large' onClick={() => {handleChangeState('LISTA_PARA_ENTREGAR');}} >
                                                Compra lista para entregar
                                            </Button>
                                        }
                                        {
                                            delivery_method === 'Retiro en local' && state === 'CONFIRMADA' &&
                                            <Button style={{ marginBottom: '10px', display: 'block', width: '100%' }} type="primary" htmlType="submit" size='large' onClick={() => {handleChangeState('LISTA_PARA_RETIRAR');}} >
                                                Compra lista para retirar
                                            </Button>
                                        }
                                        {
                                            delivery_method === 'Envío a domicilio' && state === 'LISTA_PARA_ENTREGAR' &&
                                            <Button style={{ marginBottom: '10px', display: 'block', width: '100%' }} type="primary" htmlType="submit" size='large' onClick={() => {handleChangeState('EN_VIAJE');}} >
                                                Compra en viaje
                                            </Button>
                                        }
                                        {
                                            (state === 'EN_VIAJE' || state === 'LISTA_PARA_RETIRAR' || state === 'ENTREGA_FALLIDA') && 
                                            <Button style={{ marginBottom: '10px', display: 'block', width: '100%' }} type="primary" htmlType="submit" size='large' onClick={() => {handleChangeState('ENTREGADA');}} >
                                                Compra entregada
                                            </Button>
                                        }
                                        {
                                            delivery_method === 'Envío a domicilio' && state === 'EN_VIAJE' && 
                                            <Button style={{ marginBottom: '10px', display: 'block', width: '100%' }} type="primary" htmlType="submit" size='large' onClick={() => {handleChangeState('ENTREGA_FALLIDA');}} >
                                                Compra con entrega fallida
                                            </Button>
                                        }
                                        {
                                            state !== 'CANCELADA' && state !== 'ENTREGADA' &&
                                            <Button style={{ marginBottom: '10px', display: 'block', width: '100%' }} type="primary" htmlType="submit" size='large' onClick={() => {handleChangeState('CANCELADA');}} >
                                                Compra cancelada
                                            </Button>
                                        }
                                        <Button style={{ display: 'block', width: '100%' }} type="default" htmlType="submit" size='large'>
                                            <Link to={'/order-management'} >Volver</Link>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>)
            }
        </>
    )
}

export default OrderManagementDetail;