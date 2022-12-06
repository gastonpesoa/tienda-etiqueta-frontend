import { useState, useEffect } from 'react'
import { Skeleton, Row, Col, Table, Typography, Button, Input, message, Space, Form, Select, Popconfirm, notification } from 'antd';
const { Title, Text } = Typography;

const UserManagement = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isCreateForm, setIsCreateForm] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        getUsers(`${process.env.REACT_APP_API_URL_BASE}/users`)
    }, [])

    const getUsers = async (url) => {
        setLoading(true);
        try {
            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
            const data = await res.json();
            let newArray = []
            data.data.map(item => {
                newArray.push({
                    key: item._id,
                    name: item.name,
                    last_name: item.last_name,
                    email: item.email,
                    type: item.type
                })
            })
            setUsers(newArray);
            setLoading(false);
        } catch (error) {
            message.error(error)
            console.log(error)
        }
    }

    const handleUpdateUser = (user) => {
        console.log("update", user)
        form.setFieldsValue({
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            type: user.type
        });
        setIsCreateForm(false);
        setShowForm(true)
    }

    const handleCreateUser = () => {
        console.log("create user")
        setShowForm(true);
        setIsCreateForm(true);
        form.resetFields();
    }

    const handleDeleteUser = async (user) => {
        console.log("delete", user)
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/users/${user.key}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            message.success("Usuario eliminado con éxito!")
            getUsers(`${process.env.REACT_APP_API_URL_BASE}/users`)
        } catch (error) {
            console.log(error)
        }
    }

    const cancel = (e) => {
        console.log(e)
    };

    const onFinish = (values) => {
        console.log("form finish", values)
        if (isCreateForm) {
            registerUser(values)
        } else {
            updateUserData(values)
        }
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
                    message.success(`Usario registrado con éxito!`)
                }
            })
    }

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
            getUsers(`${process.env.REACT_APP_API_URL_BASE}/users`)
        } catch (error) {
            console.log(error)
        }
    }

    const columns = [
        {
            title: 'Apellido y Nombre',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            render: (_, record) => (
                <Text key={record._id}>
                    {record.name} {record.last_name}
                </Text>
            )
        },
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email',
            width: 180,
        },
        {
            title: 'Tipo de usuario',
            dataIndex: 'type',
            key: 'type',
            width: 160,
            render: (_, record) => (
                <Text key={record._id}>
                    {record.type === "admin" ? "Administrador" : "Empleado"}
                </Text>
            )
        },
        {
            title: 'Acciones',
            width: 100,
            render: (_, record) => (
                <Space key={record._id}>
                    <Button type='primary' onClick={() => { handleUpdateUser(record) }}>
                        Modificar
                    </Button>
                    <Popconfirm
                        title="Estás seguro que deseas eliminar este usuario?"
                        onConfirm={() => { handleDeleteUser(record) }}
                        onCancel={cancel}
                        okText="Si"
                        cancelText="No"
                    >
                        <Button danger>
                            Eliminar
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <>
            {
                loading
                    ? <Skeleton active />
                    : <>
                        <Row>
                            <Col span={12}>
                                <Title level={2}>Gestión de usuarios</Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type='primary' onClick={handleCreateUser}>
                                    Crear usuario
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table dataSource={users} columns={columns}></Table>
                            </Col>
                        </Row>
                        {
                            showForm &&
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
                                                    message: 'Por favor ingresá el nombre!',
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
                                                    message: 'Por favor ingresá el apellido!',
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
                                                    message: 'Por favor ingresá el correo electrónico!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Correo electrónico" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="type"
                                            label="Tipo"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor seleccioná un tipo!',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Seleccione un tipo"
                                                allowClear
                                                options={[
                                                    { value: "admin", label: "Administrador" },
                                                    { value: "employee", label: "Empleado" }
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Contraseña"
                                            name="password"
                                        >
                                            <Input.Password placeholder="Ingrese contraseña" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={24}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Guardar modificaciones
                                        </Button>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 24 }}>
                                    <Col span={24}>
                                        <Button
                                            danger
                                            onClick={() => setShowForm(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        }
                    </>
            }
        </>
    );
}

export default UserManagement;