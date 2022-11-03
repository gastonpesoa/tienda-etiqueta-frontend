import { Row, Col, Button, Typography, Image, Space, Tag, Card, Input, Form, Select, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';
import Price from '../components/Price';
import ShoppingCartPopover from '../components/ShoppingCartPopover';
import ShoppingCartPopoverItem from '../components/ShoppingCartPopoverItem';
const { Title, Text } = Typography;

const PROVINCES = [
    { value: 'Ciudad Autónoma de Buenos Aires' },
    { value: 'Buenos aires' },
    { value: 'Catamarca' },
    { value: 'Chaco' },
    { value: 'Chubut' },
    { value: 'Córdoba' },
    { value: 'Corrientes' },
    { value: 'Entre Ríos' },
    { value: 'Formosa' },
    { value: 'Jujuy' },
    { value: 'La Pampa' },
    { value: 'La Rioja' },
    { value: 'Mendoza' },
    { value: 'Misiones' },
    { value: 'Neuquén' },
    { value: 'Río Negro' },
    { value: 'Salta' },
    { value: 'San Juan' },
    { value: 'San Luis' },
    { value: 'Santa Cruz' },
    { value: 'Santa Fe' },
    { value: 'Santiago del Estero' },
    { value: 'Tierra del Fuego' },
    { value: 'Tucumán' }
];

function Checkout() {

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
    const [items, setItems] = useState([]);
    const [subtotal, setSubtotal] = useState(1500);
    const [total, setTotal] = useState(1050);
    const [shippingCost, setShippingCost] = useState(50);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState(-500);

    const onChangePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
    }

    const onChangeDeliveryMethod = (e) => {
        setDeliveryMethod(e.target.value);
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
                                { paymentMethod === 'Tarjeta de crédito' ? 
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
                        <Row>
                            <Col span={24}><Title level={3} style={{ textAlign: 'left' }}>Resumen pedido</Title></Col>
                            <Col span={24} style={{ textAlign: 'left' }}><Text>El precio puede variar según el método de entrega.</Text></Col>
                        </Row>
                        <Space direction='vertical' size='20' align='center'>
                            {
                                items.length
                                    ? (items.map(item => (
                                        <ShoppingCartPopoverItem
                                            key={item.id}
                                            item={item}
                                        />)))
                                    : <Row><Col span={24}><Title level={4}>Tu carrito está vacío</Title></Col></Row>
                            }
                        </Space>
                        <Row>
                            <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Subtotal</Title></Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Price price={subtotal} level={5} type={"default"} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Envío</Title></Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Price price={shippingCost} level={5} type={"default"} />
                            </Col>
                        </Row>
                        {
                            discount !== 0 && 
                            <Row>
                                <Col span={12}><Title level={5} style={{ textAlign: 'left'}}>Descuento</Title></Col>
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Price price={discount} level={5} style={{ color: '#FF0000' }} type={"default"} />
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Total del pedido</Title></Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Price price={total} level={2} style={{ color: '#00BB00' }} type={"default"} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>          
        </>
    );
}

export default Checkout;