import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Typography, Image, Space, Tag, Card, Input, Form, Select, Radio, Empty, message, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { AppContext } from "../AppContext";
import ShoppingCartPopoverItem from '../components/ShoppingCartPopoverItem';
import Price from '../components/Price';
const { Title, Text } = Typography;
const { Search } = Input;

const Checkout = () => {

    const { user, token, shoppingCart, subtotal, dispatchShoppingCartEvent } = useContext(AppContext);
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const [provinces, setProvinces] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState('Retiro en local');
    const [paymentMethod, setPaymentMethod] = useState('Pago en el local');
    const [cardNumber, setCardNumber] = useState('');
    const [bank, setBank] = useState('');
    const [bankList, setBankList] = useState([]);
    const [total, setTotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [validatingDiscountCode, setValidatingDiscountCode] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [discountCode, setDiscountCode] = useState("");
    const [discountRate, setDiscountRate] = useState(0);

    useEffect(() => {
        initializeForm()
        fetch(`${process.env.REACT_APP_API_URL_BASE}/banks/valid/`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({ data }) => {
                if (data.length > 0) {
                    data.forEach((bk) => {
                        let bankAux = {};
                        bankAux.id = bk.id;
                        bankAux.value = bk.bank;
                        bankAux.label = bk.bank;
                        bankAux.discount = bk.discount_status ? bk.discount : 0;
                        if (bk.discount !== null && bk.discount > 0 && bk.discount_status) {
                            bankAux.label += ' (-' + bk.discount + '%)';
                        }
                        bankList.push(bankAux);
                    });
                } else {
                    message.error("No hay bancos disponibles");
                }
            })
            .catch((err) => {
                console.error(err);
                message.error("Hubo un error al traer el listado de bancos disponibles, intente nuevamente m??s tarde");
            });
        const getProvinces = async (url) => {
            try {
                const res = await fetch(url)
                const data = await res.json();
                setProvinces(data.data);
            } catch (error) {
                console.log(error)
            }
        }
        getProvinces(`${process.env.REACT_APP_API_URL_BASE}/provinces`)
    }, []);

    useEffect(() => {
        let result = subtotal;
        if (paymentMethod === 'Tarjeta de cr??dito') {
            result = (subtotal / 100) * (100 - discountRate);
        }
        result -= discount;
        if (deliveryMethod === 'Env??o a domicilio') {
            result += shippingCost;
        }
        setTotal(result);
    }, [subtotal, shippingCost, discount, discountRate, deliveryMethod, paymentMethod]);

    useEffect(() => {
        if (user !== undefined && user.province !== undefined && provinces.length > 0)
            onChangeProvinceSelection(user.province);
    }, [provinces])

    const initializeForm = () => {
        form.setFieldsValue({
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            address: user.address,
            city: user.city,
            province: user.province,
            postal_code: user.postal_code,
            telephone_number: user.telephone,
            delivery_method: 'Retiro en local',
            payment_method: user.warnings !== undefined && user.warnings >= 3 ? 'Tarjeta de cr??dito' : 'Pago en el local'
        });
    }

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
        let provinceSelected = provinces.find(x => x.value === value);
        setShippingCost(provinceSelected.shippingCost)
        form.setFieldsValue({
            province: value
        });
    }

    const onChangeBankSelection = (value) => {
        setBank(bankList[bankList.findIndex(x => x.value === value)]);
        setDiscountRate(bankList[bankList.findIndex(x => x.value === value)].discount);
    }

    const validateDiscountCode = (value) => {
        setValidatingDiscountCode(true);
        fetch(`${process.env.REACT_APP_API_URL_BASE}/discountCodes/code/${value}`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({ data }) => {
                if (data.length > 0) {
                    setDiscount(data[0].amount);
                    setDiscountCode(value);
                    message.success("C??digo de descuento aplicado exitosamente!");
                } else {
                    setDiscount(0);
                    setDiscountCode("");
                    message.error("El c??digo de descuento ingresado es inv??lido");
                }
            })
            .catch((err) => {
                console.error(err);
                message.error("Hubo un error al validar el c??digo de descuento, intente nuevamente m??s tarde");
                setDiscount(0);
                setDiscountCode("");
            })
            .finally(() => {
                setValidatingDiscountCode(false);
            });
    }

    const onFinish = (values) => {
        values.items = shoppingCart.map(item => {
            return { product_sku: item.sku, units: item.unit }
        })
        if (discountCode !== "") {
            values.discount_code = discountCode;
        }
        values.bank_id = bank.id;
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
                if (data.error) {
                    message.error(data.message)
                } else {
                    console.log(data)
                    dispatchShoppingCartEvent('REMOVE_ALL');
                    navigate(`../result/${data.data.id}`)
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
                        form={form}
                    >
                        {/* Informaci??n de facturaci??n */}
                        <Row>
                            <Col span={24}><Title level={2}>Informaci??n de facturaci??n</Title></Col>
                            <Col span={12}>
                                <Text>Introduzca sus datos de facturaci??n</Text>
                                <Form.Item
                                    label="Nombre"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingres?? tu nombre!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Nombre" />
                                </Form.Item>
                                <Form.Item
                                    label="Correo electr??nico"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingres?? tu correo electr??nico!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Correo electr??nico" />
                                </Form.Item>
                                <Form.Item
                                    label="Direcci??n"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingres?? tu direcci??n!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Direcci??n" />
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
                                            message: 'Por favor ingres?? tu apellido!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Apellido" />
                                </Form.Item>
                                <Form.Item
                                    label="N??mero de tel??fono"
                                    name="telephone_number"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingres?? tu n??mero de tel??fono!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="N??mero de tel??fono" />
                                </Form.Item>
                                <Form.Item
                                    label="Ciudad"
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingres?? tu ciudad!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Ciudad" />
                                </Form.Item>
                                <Form.Item
                                    label="C??digo postal"
                                    name="postal_code"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingres?? tu c??digo postal!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="C??digo postal" />
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* M??todo de entrega */}
                        <Row>
                            <Col span={24}><Title level={2}>M??todo de entrega</Title></Col>
                            <Col span={12}>
                                <Text>Seleccione un m??todo de entrega</Text>
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
                                            message: 'Por favor seleccione un m??todo de entrega!',
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
                                                    ??Sin costo!
                                                </Text>
                                            </Card>
                                            <Card>
                                                <Radio value={'Env??o a domicilio'}>
                                                    Env??o a domicilio
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
                                                            Seleccione una provincia para calcular el costo de env??o
                                                        </Text>
                                                }
                                            </Card>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* Medio de pago */}
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
                                                {
                                                    user.warnings >= 3 && <><Radio value={'Pago en el local'} disabled>Pago en el local</Radio>El medio de pago en el local se encuentra deshabilitado para usted</>
                                                }
                                                {
                                                    (user.warnings === undefined || user.warnings < 3) && <Radio value={'Pago en el local'}>Pago en el local</Radio>
                                                }
                                            </Card>
                                            <Card>
                                                <Radio value={'Tarjeta de cr??dito'}>
                                                    Tarjeta de cr??dito
                                                </Radio>
                                            </Card>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24} style={{ paddingTop: 10 }}>
                                {paymentMethod === 'Tarjeta de cr??dito' ?
                                    <Card>
                                        <Row>
                                            <Col span={14}>
                                                <Form.Item
                                                    label="N??mero de la tarjeta"
                                                    name="card_number"
                                                    value={cardNumber}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingres?? el n??mero de la tarjeta!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="N??mero de la tarjeta" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Banco"
                                                    name="bank"
                                                    value={bank}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor selecciona tu banco!',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        options={bankList}
                                                        placeholder="Elija un banco"
                                                        onChange={onChangeBankSelection}
                                                    >
                                                    </Select>
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
                                                            message: 'Por favor ingres?? el titular!',
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
                                                            message: 'Por favor ingres?? la fecha de vencimiento!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="MM/YY" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={5}>
                                                <Form.Item
                                                    label="CVC"
                                                    name="cvc"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingres?? el CVC!',
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
                        {/* Notas de la orden */}
                        <Row style={{ paddingTop: 25 }}>
                            <Col span={24}><Title level={2}>Informaci??n adicional</Title></Col>
                            <Col span={12}>
                                <Text>??Necesita algo m??s? ??Lo haremos por usted!</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Paso 4/4</Text>
                            </Col>
                        </Row>
                        {/* Button submit */}
                        <Row style={{ paddingTop: 15 }}>
                            <Col span={24}>
                                <Form.Item
                                    label="Notas de la orden"
                                    name="order_notes"
                                >
                                    <TextArea rows={4} placeholder="??Necesita un d??a de entrega espec??fico? ??Enviar un regalo? D??ganos que..." />
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
                    {/* Resumen */}
                    <Card style={{ marginLeft: 30 }}>
                        {
                            shoppingCart.length
                                ?
                                <>

                                    <Row>
                                        <Col span={24}><Title level={3} style={{ textAlign: 'left' }}>Resumen pedido</Title></Col>
                                        <Col span={24} style={{ textAlign: 'left' }}><Text>El precio puede variar seg??n el m??todo de entrega.</Text></Col>
                                    </Row>
                                    <Space direction='vertical' size='20' align='center'>
                                        {
                                            shoppingCart.map(item => (
                                                <ShoppingCartPopoverItem
                                                    key={item.sku}
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
                                        shippingCost !== 0 && deliveryMethod === 'Env??o a domicilio' &&
                                        <Row>
                                            <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Env??o</Title></Col>
                                            <Col span={12} style={{ textAlign: 'right' }}>
                                                <Price price={shippingCost} level={5} type={"default"} />
                                            </Col>
                                        </Row>
                                    }
                                    {
                                        discount !== 0 &&
                                        <Row>
                                            <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Descuento por c??digo promocional</Title></Col>
                                            <Col span={12} style={{ textAlign: 'right' }}>
                                                <Price price={discount} level={5} style={{ color: '#FF0000' }} type={"default"} />
                                            </Col>
                                        </Row>
                                    }
                                    {
                                        discountRate !== 0 && paymentMethod === 'Tarjeta de cr??dito' &&
                                        <Row>
                                            <Col span={12}><Title level={5} style={{ textAlign: 'left' }}>Descuento por promoci??n bancaria</Title></Col>
                                            <Col span={12} style={{ textAlign: 'right' }}>
                                                <Price price={subtotal - (subtotal / 100) * (100 - discountRate)} level={5} style={{ color: '#FF0000' }} type={"default"} />
                                            </Col>
                                        </Row>
                                    }
                                    <Row>
                                        {
                                            !validatingDiscountCode ?
                                                <Col span={24}>
                                                    <Search placeholder="Aplicar c??digo de descuento" onSearch={validateDiscountCode} enterButton="Aplicar" />
                                                </Col>
                                                :
                                                <Col span={24}>
                                                    <Search placeholder="Aplicar c??digo de descuento" loading enterButton="Aplicar" />
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
                                            Tu carrito est?? vac??o
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