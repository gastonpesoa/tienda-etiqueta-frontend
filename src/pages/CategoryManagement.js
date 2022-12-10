import { useState, useEffect } from 'react'
import { Skeleton, Row, Col, Table, Typography, Button, Input, message, Space, Form, InputNumber, DatePicker, Popconfirm, notification, Switch } from 'antd';
import moment from 'moment';
import Price from "../components/Price";
import { formatDate } from '../Utils'
const { Title, Text } = Typography;

const CategoryManagement = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isCreateForm, setIsCreateForm] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/categories`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
            const data = await res.json();
            let newArray = []
            data.data.map(item => {
                newArray.push({
                    key: item.id,
                    name: item.name,
                    url: item.url
                })
            })
            setCategories(newArray);
            setLoading(false);
        } catch (error) {
            message.error(error)
            console.log(error)
        }
    }

    const handleUpdateCategory = (item) => {
        form.setFieldsValue({
            name: item.name,
            url: item.url
        });
        setUpdateId(item.key);
        setIsCreateForm(false);
        setShowForm(true)
    }

    const handleCreateCategory = () => {
        setShowForm(true);
        setIsCreateForm(true);
        form.resetFields();
    }

    const handleDeleteCategory = async (item) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/categories/id/${item.key}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            message.success("Categoría eliminada con éxito!")
            getCategories()
        } catch (error) {
            console.log(error)
        }
    }

    const cancel = (e) => {
        console.log(e)
    };

    const onFinish = (values) => {
        if (isCreateForm) {
            registerCategory(values)
        } else {
            updateCategory(values)
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

    const registerCategory = (value) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/categories`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value)
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    message.error(data.message)
                    console.log(data)
                } else {
                    message.success(`Categoría registrada con éxito!`)
                    getCategories()
                }
            })
    }

    const updateCategory = async (values) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/categories/id/${updateId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            const data = await res.json();
            message.success("Las modificaciones han sido registradas con éxito!")
            getCategories()
        } catch (error) {
            console.log(error)
        }
    }

    const columns = [
        {
            title: 'Categoría',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url'
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space key={record._id}>
                    <Button type='primary' onClick={() => { handleUpdateCategory(record) }}>
                        Modificar
                    </Button>
                    <Popconfirm
                        title="Estás seguro que deseas eliminar esta categoría?"
                        onConfirm={() => { handleDeleteCategory(record) }}
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
                                <Title level={2}>Gestión de categorías</Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type='primary' onClick={handleCreateCategory}>
                                    Crear categoría
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table dataSource={categories} columns={columns} pagination={{ pageSize: 5 }}></Table>
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
                                            label="Categoría"
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor ingresá el nombre de la categoría!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Ingrese el nombre de la categoría" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="URL"
                                            name="url"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor ingresá la URL de la categoría!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Ingrese la URL de la categoría" />
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

export default CategoryManagement;