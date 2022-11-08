import { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Typography, Image, Space, Tag, Card, Input, Form, Select, Radio, Empty } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { AppContext } from "../AppContext";
import ShoppingCartPopoverItem from '../components/ShoppingCartPopoverItem';
import Price from '../components/Price';
const { Title, Text } = Typography;
const { Search } = Input;

const PROVINCES = [
    { value: 'Ciudad Autónoma de Buenos Aires', shippingCost: 100 },
    { value: 'Buenos aires', shippingCost: 200 },
    { value: 'Catamarca', shippingCost: 300 },
    { value: 'Chaco', shippingCost: 300 },
    { value: 'Chubut', shippingCost: 300 },
    { value: 'Córdoba', shippingCost: 250 },
    { value: 'Corrientes', shippingCost: 300 },
    { value: 'Entre Ríos', shippingCost: 250 },
    { value: 'Formosa', shippingCost: 300 },
    { value: 'Jujuy', shippingCost: 300 },
    { value: 'La Pampa', shippingCost: 250 },
    { value: 'La Rioja', shippingCost: 300 },
    { value: 'Mendoza', shippingCost: 300 },
    { value: 'Misiones', shippingCost: 300 },
    { value: 'Neuquén', shippingCost: 300 },
    { value: 'Río Negro', shippingCost: 250 },
    { value: 'Salta', shippingCost: 300 },
    { value: 'San Juan', shippingCost: 300 },
    { value: 'San Luis', shippingCost: 300 },
    { value: 'Santa Cruz', shippingCost: 300 },
    { value: 'Santa Fe', shippingCost: 250 },
    { value: 'Santiago del Estero', shippingCost: 300 },
    { value: 'Tierra del Fuego', shippingCost: 300 },
    { value: 'Tucumán', shippingCost: 300 }
];

const Checkout = () => {

    const { shoppingCart, subtotal } = useContext(AppContext);
    
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [telephoneNumber, setTelephoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('Retiro en local');
    const [paymentMethod, setPaymentMethod] = useState('Pago en el local');
    const [cardNumber, setCardNumber] = useState('');
    const [titular, setTitular] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [total, setTotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [validatingDiscountCode, setValidatingDiscountCode] = useState(false);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        let result = subtotal - discount;
        if (deliveryMethod === 'Envío a domicilio') {
            result += shippingCost;
        }
        setTotal(result);
    }, [subtotal, shippingCost, discount, deliveryMethod])

    const onChangePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
    }

    const onChangeDeliveryMethod = (e) => {
        setDeliveryMethod(e.target.value);
    }

    const onChangeProvinceSelection = (value) => {
        PROVINCES.find(function (province, index) {
            if (province.value === value) {
                setShippingCost(province.shippingCost);
                return true;
            }

            return false;
        });
    }

    const validateDiscountCode = (value) => {
        setValidatingDiscountCode(true);

        // Simula validar el código en el backend hasta tener listo en endpoint
        setTimeout(() => {
            setValidatingDiscountCode(false);
            setDiscount(2000);
        }, 2000);
        console.log(value);
    }

    return (
        <>
            <Row>
                <Col span={14}>
                    <Form
                        labelCol={{ span: 22 }}
                        wrapperCol={{ span: 22 }}
                        layout="vertical"
                    >
                        <Row>
                            <Col span={24}><Title level={2}>Información de facturación</Title></Col>
                            <Col span={12}>
                                <Text>Introduzca sus datos de facturación</Text>
                                <Form.Item
                                    label="Nombre"
                                    name="name"
                                    value={name}
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
                                    value={email}
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
                                    value={address}
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
                                    value={province}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor selecciona tu provincia!',
                                        },
                                    ]}
                                >
                                    <Select
                                        defaultValue=""
                                        options={PROVINCES}
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
                                    value={lastName}
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
                                    value={telephoneNumber}
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
                                    value={city}
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
                                    value={postalCode}
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
                                <Radio.Group onChange={onChangeDeliveryMethod} value={deliveryMethod}>
                                    <Space direction="vertical">
                                        <Radio value={'Retiro en local'}>Retiro en local</Radio>
                                        <Radio value={'Envío a domicilio'}>
                                            Envío a domicilio
                                        </Radio>
                                    </Space>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row>
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
                                <Radio.Group onChange={onChangePaymentMethod} value={paymentMethod}>
                                    <Space direction="vertical">
                                        <Radio value={'Pago en el local'}>Pago en el local</Radio>
                                        <Radio value={'Tarjeta de crédito'}>
                                            Tarjeta de crédito

                                        </Radio>

                                    </Space>
                                </Radio.Group>
                            </Col>
                            <Col span={24}>
                                {paymentMethod === 'Tarjeta de crédito' ?
                                    <>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Número de la tarjeta"
                                                    name="card_number"
                                                    value={cardNumber}
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
                                                    value={titular}
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
                                                    value={dueDate}
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
                                                    value={cvc}
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
                                    </>
                                    : null
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}><Title level={2}>Información adicional</Title></Col>
                            <Col span={12}>
                                <Text>¿Necesita algo más? ¡Lo haremos por usted!</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Paso 4/4</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Notas de la orden"
                                    name="order_notes"
                                >
                                    <TextArea rows={4} placeholder="¿Necesita un día de entrega específico? ¿Enviar un regalo? Díganos que..." />
                                </Form.Item>
                                <Button
                                    type="primary"
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