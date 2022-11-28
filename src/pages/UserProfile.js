import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, Button, Typography, Skeleton, Table, Tag, Tooltip, Form, Input, Select, notification, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
const { Title, Text } = Typography;

const UserProfile = () => {

    const { user, dispatchUserEvent } = useContext(AppContext);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        console.log("user", user)
        initializeForm()
        const getOrders = async (url) => {
            try {
                setLoading(true);
                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                })
                const data = await res.json();
                let newOrdersArray = []
                data.data.map(item => {
                    let d = new Date(item.date);
                    let ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(d);
                    let mo = new Intl.DateTimeFormat('es', { month: 'long' }).format(d);
                    let da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(d);
                    let formatedSate = `${da} de ${mo} ${ye}`
                    let productsDescriptions = item.items[0].product.title
                    if (item.items.length > 1) {
                        item.items.map((element, i) => {
                            if (i !== 0) {
                                productsDescriptions += ` - ${element.product.title}`
                            }
                        })
                    }
                    newOrdersArray.push({
                        key: item._id,
                        date: formatedSate,
                        state: item.state,
                        productsQuantity: item.items.length,
                        products: productsDescriptions
                    })
                })
                setOrders(newOrdersArray);
                setLoading(false);
            } catch (error) {
                alert(error)
            }
        }
        const getProvinces = async (url) => {
            try {
                const res = await fetch(url)
                const data = await res.json();
                setProvinces(data.data);
            } catch (error) {
                console.log(error)
            }
        }
        getOrders(`${process.env.REACT_APP_API_URL_BASE}/orders/`)
        getProvinces(`${process.env.REACT_APP_API_URL_BASE}/provinces`)
    }, [])

    const initializeForm = () => {
        form.setFieldsValue({
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            address: user.address,
            telephone: user.telephone,
            city: user.city,
            province: user.province,
            postal_code: user.postal_code
        });
    }

    const onFinish = (values) => {
        console.log(values)
        updateUserData(values)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        errorInfo.errorFields.map((e) => {
            openNotificationWithIcon(e.errors[0])
        })
    };

    const updateUserData = async (values) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/users`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            const data = await res.json();
            message.success("Las modificaciones han sido registradas con éxito!")
            dispatchUserEvent(localStorage.getItem("token"), data.data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseSesion = () => {
        dispatchUserEvent('', {})
        navigate('/')
    }

    const openNotificationWithIcon = (message) => {
        notification['error']({
            message: 'Cargue sus datos',
            description: message,
        });
    };

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
            width: 180,
        },
        {
            title: 'Artículos',
            dataIndex: 'products',
            key: 'products',
            ellipsis: true,
        },
        {
            title: 'Cantidad de Artículos',
            dataIndex: 'productsQuantity',
            key: 'productsQuantity',
            width: 160,
        },
        {
            title: 'Detalle',
            key: 'detail',
            width: 80,
            render: (_, record) => (
                <Link key={record.id} to={`order-detail/${record.id}`}>
                    <Button type='link' style={{ padding: '0' }}>Ver</Button>
                </Link>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'state',
            key: 'state',
            width: 225,
            render: (_, record) => {
                let color = '';
                switch (record.state) {
                    case 'CONFIRMADA':
                        color = '#40a9ff';
                        break;
                    case 'LISTA_PARA_RETIRAR':
                        color = '#85a5ff';
                        break;
                    case 'LISTA_PARA_ENTREGAR':
                        color = '#bae637';
                        break;
                    case 'EN_VIAJE':
                        color = '#73d13d';
                        break;
                    case 'ENTREGADA':
                        color = 'green';
                        break;
                    case 'ENTREGA_FALLIDA':
                        color = '#ffec3d';
                        break;
                    case 'CANCELADA':
                        color = 'volcano';
                        break;
                    default:
                        break;
                }
                return <Tag color={color} key={record.id}>
                    {record.state}
                </Tag>

            }
        }
    ];

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : <>
                        <Row>
                            <Col span={12}><Title level={2}>Perfil de usuario</Title></Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Tooltip placement="bottomRight" title='Cerrar sesión'>
                                    <Button
                                        onClick={handleCloseSesion}
                                        type='link'
                                        icon={<LogoutOutlined style={{ fontSize: '24px', color: 'black' }} />}
                                    />
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}><Text type="secondary">Sus datos de usuario</Text></Col>
                        </Row>
                        <Row>
                            <Col span={14}>
                                <Form
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    form={form}
                                >
                                    <Row gutter={8}>
                                        <Col span={12}>
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
                                        </Col>
                                        <Col span={12}>
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
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={12}>
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
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Número de teléfono"
                                                name="telephone"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Por favor ingresá tu número de teléfono!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Número de teléfono" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={12}>
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
                                        </Col>
                                        <Col span={12}>
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
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="province"
                                                label="Provincia"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Por favor seleccioná tu provincia!',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Seleccione una provincia"
                                                    allowClear
                                                    options={provinces}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
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
                                        <Col span={24}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                size='large'
                                            >
                                                Guardar modificaciones
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '40px' }}>
                            <Col span={24}><Title level={2}>Listado de compras</Title></Col>
                        </Row>
                        <Row>
                            <Col span={24}><Text type="secondary">Su historial de compras</Text></Col>
                        </Row>
                        <Row>
                            <Table dataSource={orders} columns={columns} />
                        </Row>
                    </>
            }
        </>
    )
}

export default UserProfile