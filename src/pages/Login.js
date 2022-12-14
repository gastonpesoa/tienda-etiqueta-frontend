import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Form, Input, message } from 'antd';
import { AppContext } from "../AppContext";
const { Title } = Typography;

const Login = () => {

    const { dispatchUserEvent } = useContext(AppContext);
    const navigate = useNavigate()

    const onFinish = (values) => {
        login(values)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const login = (value) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value)
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert("Usuario o contraseña incorrecta")
                } else {
                    message.success(`Bienvenido ${data.data.user.name}!`)
                    dispatchUserEvent(data.data.token, data.data.user);
                    navigate('/')
                }
            })
    }

    return (
        <Form
            layout="vertical"
            name="basic"
            labelCol={{
                span: 8,
                offset: 8
            }}
            wrapperCol={{
                span: 8,
                offset: 8
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item>
                <Title level={3} >Ingreso de usuario</Title>
                <Title level={5} type="secondary">Introduzca sus datos de usuario</Title>
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
                <Input type='email' placeholder="Ingrese correo electrónico" />
            </Form.Item>

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

            <Form.Item>
                <Button type="primary" htmlType="submit" size='large' style={{ marginRight: '8px' }}>
                    Ingresar
                </Button>
                <Link to="/register">
                    <Button
                        type="default"
                        size='large'
                    >
                        Crear una cuenta
                    </Button>
                </Link>
            </Form.Item>
        </Form>
    );
}

export default Login;