import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Typography, Image, Space, Tag, Card, Input, Form, Select, Radio, Empty, message, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { AppContext } from "../AppContext";
import ShoppingCartPopoverItem from '../components/ShoppingCartPopoverItem';
import Price from '../components/Price';
import myData from '../data.json';
const { Title, Text } = Typography;
const { Search } = Input;

const Checkout = () => {

    const { user, token, shoppingCart, subtotal } = useContext(AppContext);
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const { provinces } = myData;

    const [deliveryMethod, setDeliveryMethod] = useState('Retiro en local');
    const [paymentMethod, setPaymentMethod] = useState('Pago en el local');
    const [total, setTotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [validatingDiscountCode, setValidatingDiscountCode] = useState(false);
    const [discount, setDiscount] = useState(0);

    const fields = [
        {
            name: ['name'],
            value: user.name
        },
        {
            name: ['last_name'],
            value: user.last_name
        },
        {
            name: ['email'],
            value: user.email
        },
        {
            name: ['address'],
            value: user.address
        },
        {
            name: ['city'],
            value: user.city
        },
        {
            name: ['province'],
            value: user.state
        },
        {
            name: ['postal_code'],
            value: user.postal_code
        },
    ]

    useEffect(() => {
        let result = subtotal - discount;
        if (deliveryMethod === 'Envío a domicilio') {
            result += shippingCost;
        }
        setTotal(result);
    }, [subtotal, shippingCost, discount, deliveryMethod])

    // useEffect(() => {
    //     var items = shoppingCart.map(item => {
    //         return { product_id: item.id, units: item.unit }
    //     })
    //     form.setFieldsValue({
    //         items: items,
    //     });
    // }, [])

    const onChangePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
        form.setFieldsValue({
            payment_method: e.target.value,
        });
    }

    const onChangeDeliveryMethod = (e) => {
        setDeliveryMethod(e.target.value);
        form.setFieldsValue({
            delivery_method: e.target.value,
        });
    }

    const onChangeProvinceSelection = (value) => {
        provinces.find(function (province, index) {
            if (province.value === value) {
                setShippingCost(province.shippingCost);
                return true;
            }

            return false;
        });
    }

    const validateDiscountCode = (value) => {

        setValidatingDiscountCode(true);

        fetch(`${process.env.REACT_APP_API_URL_BASE}/discountCodes/code/${value}`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({ data }) => {
                if (data.length > 0) {
                    setDiscount(data[0].amount);
                    message.success("Código de descuento aplicado exitosamente!");
                } else {
                    setDiscount(0);
                    message.error("El código de descuento ingresado es inválido");
                }
            })
            .catch((err) => {
                console.error(err);
                message.error("Hubo un error al validar el código de descuento, intente nuevamente más tarde");
                setDiscount(0);
            })
            .finally(() => {
                setValidatingDiscountCode(false);
            });
    }

    const onFinish = (values) => {
        values.items = shoppingCart.map(item => {
            return { product_id: item.id, units: item.unit }
        })
        console.log(values)
        registerOrder(values)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        errorInfo.errorFields.map((e) => {
            openNotificationWithIcon(e.errors[0])
        })
    };

    const openNotificationWithIcon = (message) => {
        notification['error']({
            message: 'Cargue sus datos',
            description: message,
        });
    };

    const registerOrder = (values) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/orders`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    message.error(data.message)
                } else {
                    message.success(`Orden nº ${data.id} registrada con éxito!`)
                    //navigate('/')
                }
            })
    }

    return (
        <>
            <Row>
                <Col span={14}>
                    <Form
                        labelCol={{ span: 22 }}
                        wrapperCol={{ span: 22 }}
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        fields={fields}
                    >
                        <Row>
                            <Col span={24}><Title level={2}>Información de facturación</Title></Col>
                            <Col span={12}>
                                <Text>Introduzca sus datos de facturación</Text>
                                <Form.Item
                                    label="Nombre"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingresá tu nombre!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Nombre" />
                                </Form.Item>
                                <Form.Item
                                    label="Correo electrónico"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingresá tu correo electrónico!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Correo electrónico" />
                                </Form.Item>
                                <Form.Item
                                    label="Dirección"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingresá tu dirección!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Dirección" />
                                </Form.Item>
                                <Form.Item
                                    label="Provincia"
                                    name="province"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor selecciona tu provincia!',
                                        },
                                    ]}
                                >
                                    <Select
                                        options={provinces}
                                        placeholder="Elija una provincia"
                                        onChange={onChangeProvinceSelection}

                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Paso 1/4</Text>
                                <Form.Item
                                    label="Apellido"
                                    name="last_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingresá tu apellido!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Apellido" />
                                </Form.Item>
                                <Form.Item
                                    label="Número de teléfono"
                                    name="telephone_number"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingresá tu número de teléfono!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Número de teléfono" />
                                </Form.Item>
                                <Form.Item
                                    label="Ciudad"
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingresá tu ciudad!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Ciudad" />
                                </Form.Item>
                                <Form.Item
                                    label="Código postal"
                                    name="postal_code"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingresá tu código postal!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Código postal" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}><Title level={2}>Método de entrega</Title></Col>
                            <Col span={12}>
                                <Text>Seleccione un método de entrega</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Paso 2/4</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="delivery_method"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor seleccione un método de entrega!',
                                        },
                                    ]}
                                >
                                    <Radio.Group
                                        onChange={onChangeDeliveryMethod}
                                        value={deliveryMethod}
                                        style={{ width: '100%' }}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Card>
                                                <Radio value={'Retiro en local'}>Retiro en local</Radio>
                                                <Text style={{ color: 'green', paddingLeft: 18 }} strong>
                                                    ¡Sin costo!
                                                </Text>
                                            </Card>
                                            <Card>
                                                <Radio value={'Envío a domicilio'}>
                                                    Envío a domicilio
                                                </Radio>
                                                {
                                                    shippingCost !== 0 ?
                                                        <>
                                                            <Text style={{ color: 'green' }} strong>
                                                                +$ {shippingCost}
                                                            </Text>
                                                            <Text strong> Precio adicional</Text>
                                                        </>
                                                        :
                                                        <Text strong>
                                                            Seleccione una provincia para calcular el costo de envío
                                                        </Text>
                                                }
                                            </Card>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: 25 }}>
                            <Col span={24}><Title level={2}>Medio de pago</Title></Col>
                            <Col span={12}>
                                <Text>Seleccione un medio de pago</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Paso 3/4</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="payment_method"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor seleccione un medio de pago!',
                                        },
                                    ]}
                                >
                                    <Radio.Group
                                        onChange={onChangePaymentMethod}
                                        value={paymentMethod}
                                        style={{ width: '100%' }}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Card>
                                                <Radio value={'Pago en el local'}>Pago en el local</Radio>
                                            </Card>
                                            <Card>
                                                <Radio value={'Tarjeta de crédito'}>
                                                    Tarjeta de crédito
                                                </Radio>
                                            </Card>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24} style={{ paddingTop: 10 }}>
                                {paymentMethod === 'Tarjeta de crédito' ?
                                    <Card>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Número de la tarjeta"
                                                    name="card_number"
                                                    labelCol={24}
                                                    wrapperCol={24}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingresá el número de la tarjeta!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Número de la tarjeta" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={14}>
                                                <Form.Item
                                                    label="Titular"
                                                    name="titular"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingresá el titular!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Titular" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={5}>
                                                <Form.Item
                                                    label="Fecha de Vto"
                                                    name="due_date"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingresá la fecha de vencimiento!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="DD/MM/YY" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={5}>
                                                <Form.Item
                                                    label="CVC"
                                                    name="cvc"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingresá el CVC!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="CVC" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                    : null
                                }
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: 25 }}>
                            <Col span={24}><Title level={2}>Información adicional</Title></Col>
                            <Col span={12}>
                                <Text>¿Necesita algo más? ¡Lo haremos por usted!</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Paso 4/4</Text>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: 15 }}>
                            <Col span={24}>
                                <Form.Item
                                    label="Notas de la orden"
                                    name="order_notes"
                                >
                                    <TextArea rows={4} placeholder="¿Necesita un día de entrega específico? ¿Enviar un regalo? Díganos que..." />
                                </Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size='large'
                                >
                                    Completar orden
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
                    <Card style={{ marginLeft: 30 }}>
                        {
                            shoppingCart.length
                                ?
                                <>

                                    <Row>
                                        <Col span={24}><Title level={3} style={{ textAlign: 'left' }}>Resumen pedido</Title></Col>
                                        <Col span={24} style={{ textAlign: 'left' }}><Text>El precio puede variar según el método de entrega.</Text></Col>
                                    </Row>
                                    <Space direction='vertical' size='20' align='center'>
                                        {
                                            shoppingCart.map(item => (
                                                <ShoppingCartPopoverItem
                                                    key={item.id}
                                                    item={item}
                                                />))

                                        }
                                    </Space>
                                    <Row>
                                        <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Subtotal</Title></Col>
                                        <Col span={12} style={{ textAlign: 'right' }}>
                                            <Price price={subtotal} level={5} type={"default"} />
                                        </Col>
                                    </Row>
                                    {
                                        shippingCost !== 0 && deliveryMethod === 'Envío a domicilio' &&
                                        <Row>
                                            <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Envío</Title></Col>
                                            <Col span={12} style={{ textAlign: 'right' }}>
                                                <Price price={shippingCost} level={5} type={"default"} />
                                            </Col>
                                        </Row>
                                    }
                                    {
                                        discount !== 0 &&
                                        <Row>
                                            <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Descuento</Title></Col>
                                            <Col span={12} style={{ textAlign: 'right' }}>
                                                <Price price={discount} level={5} style={{ color: '#FF0000' }} type={"default"} />
                                            </Col>
                                        </Row>
                                    }
                                    <Row>
                                        {
                                            !validatingDiscountCode ?
                                                <Col span={24}>
                                                    <Search placeholder="Aplicar código de descuento" onSearch={validateDiscountCode} enterButton="Aplicar" />
                                                </Col>
                                                :
                                                <Col span={24}>
                                                    <Search placeholder="Aplicar código de descuento" loading enterButton="Aplicar" />
                                                </Col>
                                        }
                                    </Row>
                                    <Row>
                                        <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Total del pedido</Title></Col>
                                        <Col span={12} style={{ textAlign: 'right' }}>
                                            <Price price={total} level={2} style={{ color: '#00BB00' }} type={"default"} />
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Empty style={{ justifyContent: 'center' }}
                                    description={
                                        <Title level={5}>
                                            Tu carrito está vacío
                                        </Title>
                                    }
                                />
                        }

                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Checkout;