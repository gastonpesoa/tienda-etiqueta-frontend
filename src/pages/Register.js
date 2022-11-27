import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { Col, Row, Button, Typography, Form, Input, Select, InputNumber, message } from 'antd';
import { AppContext } from "../AppContext";
import myData from '../data.json';
const { Option } = Select;
const { Title } = Typography;

const Register = () => {

    const { dispatchUserEvent } = useContext(AppContext);
    const navigate = useNavigate()
    const { provinces } = myData;

    const onFinish = (values) => {
        registerUser(values)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const registerUser = (value) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value)
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    message.error(data.message)
                    console.log(data)
                } else {
                    message.success(`Bienvenido ${data.data.user.name}, tu usario ha sido registrado con éxito!`)
                    dispatchUserEvent(data.data.token, data.data.user);
                    navigate('/')
                }
            })
    }

    return (
        <Row>
            <Col span={8}></Col>
            <Col span={8}>
                <Form
                    layout="vertical"
                    name="basic"
                    labelCol={{
                        span: 24
                    }}
                    wrapperCol={{
                        span: 24
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item>
                        <Title level={3} >Registro de usuario</Title>
                        <Title level={5} type="secondary">Introduzca sus datos de usuario</Title>
                    </Form.Item>
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
                                <Input placeholder="Ingrese nombre" />
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
                                <Input placeholder="Ingrese apellido" />
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
                                <Input type='email' placeholder="Ingrese correo electrónico" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Contraseña"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingresá tu contraseña!',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Ingrese contraseña" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label="Diección"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingresá tu dirección!',
                                    },
                                ]}
                            >
                                <Input placeholder="Ingrese dirección" />
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
                                <Input placeholder="Ingrese ciudad" />
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
                                name='postal_code'
                                label="Código postal"
                                rules={[
                                    {
                                        type: 'number'
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" size='large' style={{ marginRight: '8px' }}>
                            Registrarme
                        </Button>
                        <Link to="/login">
                            <Button
                                type="default"
                                size='large'
                            >
                                Ingreso de usuario
                            </Button>
                        </Link>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={8}></Col>
        </Row>
    );
}

export default Register;