import { useState, useEffect } from 'react'
import { Skeleton, Row, Col, Table, Typography, Button, Input, message, Space, Form, InputNumber, DatePicker, Popconfirm, notification, Switch, Select } from 'antd';
const { Title } = Typography;

const SubcategoryManagement = () => {

    const [subcategories, setSubcategories] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isCreateForm, setIsCreateForm] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        getCategories();
        getSubcategories();
    }, [])

    const getSubcategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/subcategories`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
            const data = await res.json();
            let newArray = []
            data.data.map(item => {
                newArray.push({
                    key: item.id,
                    name: item.name,
                    url: item.url,
                    category: item.category
                })
            })
            setSubcategories(newArray);
            setLoading(false);
        } catch (error) {
            message.error(error)
            console.log(error)
        }
    }

    const getCategories = () => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/categories/`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({ data }) => {
                setCategoriesList([]);
                if (data.length > 0) {
                    data.forEach((category) => {
                        setCategoriesList((savedCategories) => {
                            return [
                                ...savedCategories,
                                {
                                    id: category.id,
                                    value: category.id,
                                    label: category.name
                                }
                            ];
                        })
                    });
                } else {
                    message.error("No hay categorías disponibles");
                }
            })
            .catch((err) => {
                console.error(err);
                message.error("Hubo un error al traer el listado de categorías, intente nuevamente más tarde");
            });
    }

    const handleUpdateSubcategory = (item) => {
        console.log(item);
        form.setFieldsValue({
            name: item.name,
            url: item.url,
            idCategory: item.category.id
        });
        setUpdateId(item.key);
        setIsCreateForm(false);
        setShowForm(true)
    }

    const handleCreateSubcategory = () => {
        setShowForm(true);
        setIsCreateForm(true);
        form.resetFields();
    }

    const handleDeleteSubcategory = async (item) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/subcategories/id/${item.key}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();

            if (res.status !== 200) {
                message.error(data.message);
            } else {
                message.success("Sub-categoría eliminada con éxito!")
                getSubcategories();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const cancel = (e) => {
        console.log(e)
    };

    const onFinish = (values) => {
        if (isCreateForm) {
            registerSubcategory(values)
        } else {
            updateSubcategory(values)
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

    const registerSubcategory = (value) => {
        console.log(value);
        fetch(`${process.env.REACT_APP_API_URL_BASE}/subcategories`, {
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
                    message.success(`Subcategoría registrada con éxito!`)
                    getSubcategories()
                }
            })
    }

    const updateSubcategory = async (values) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/subcategories/id/${updateId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            const data = await res.json();
            message.success("Las modificaciones han sido registradas con éxito!")
            getSubcategories()
        } catch (error) {
            console.log(error)
        }
    }

    const columns = [
        {
            title: 'Subcategoría',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url'
        },
        {
            title: 'Categoría padre',
            dataIndex: 'category',
            key: 'category',
            render: (_, record) => {
                return record.category.name;
            }
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space key={record._id}>
                    <Button type='primary' onClick={() => { handleUpdateSubcategory(record) }}>
                        Modificar
                    </Button>
                    <Popconfirm
                        title="Estás seguro que deseas eliminar esta sub-categoría?"
                        onConfirm={() => { handleDeleteSubcategory(record) }}
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
                                <Title level={2}>Gestión de sub-categorías</Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type='primary' onClick={handleCreateSubcategory}>
                                    Crear sub-categoría
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table dataSource={subcategories} columns={columns} pagination={{ pageSize: 5 }}></Table>
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
                                    <Col span={8}>
                                        <Form.Item
                                            label="Sub-categoría"
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor ingresá el nombre de la sub-categoría!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Ingrese el nombre de la sub-categoría" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="URL"
                                            name="url"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor ingresá la URL de la sub-categoría!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Ingrese la URL de la sub-categoría" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="idCategory"
                                            label="Categoría padre"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor seleccione la categoría padre de la sub-categoría!',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Seleccione una categoría padre"
                                                allowClear
                                                options={categoriesList}
                                            />
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

export default SubcategoryManagement;