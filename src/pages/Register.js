import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { Col, Row, Button, Typography, Form, Input, Select, InputNumber } from 'antd';
const { Option } = Select;
const { Title } = Typography;

const Register = () => {

    const navigate = useNavigate()

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
                    alert("La contraseña debe tener 8 caracteres")
                } else {
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
                                name="state"
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
                                >
                                    <Option value="Ciudad Autónoma de Buenos Aires">Ciudad Autónoma de Buenos Aires</Option>
                                    <Option value="Buenos Aires">Buenos Aires</Option>
                                    <Option value="Catamarca">Catamarca</Option>
                                    <Option value="Chaco">Chaco</Option>
                                    <Option value="Chubut">Chubut</Option>
                                    <Option value="Córdoba">Córdoba</Option>
                                    <Option value="Corrientes">Corrientes</Option>
                                    <Option value="Entre Ríos">Entre Ríos</Option>
                                    <Option value="Formosa">Formosa</Option>
                                    <Option value="Jujuy">Jujuy</Option>
                                    <Option value="La Pampa">La Pampa</Option>
                                    <Option value="La Rioja">La Rioja</Option>
                                    <Option value="Mendoza">Mendoza</Option>
                                    <Option value="Misiones">Misiones</Option>
                                    <Option value="Neuquén">Neuquén</Option>
                                    <Option value="Río Negro">Río Negro</Option>
                                    <Option value="Salta">Salta</Option>
                                    <Option value="San Juan">San Juan</Option>
                                    <Option value="San Luis">San Luis</Option>
                                    <Option value="Santa Cruz">Santa Cruz</Option>
                                    <Option value="Santa Fe">Santa Fe</Option>
                                    <Option value="Santiago del Estero">Santiago del Estero</Option>
                                    <Option value="Tierra del Fuego">Tierra del Fuego</Option>
                                    <Option value="Tucumán">Tucumán</Option>
                                </Select>
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