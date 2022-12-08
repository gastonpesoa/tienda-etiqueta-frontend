import { Space, Row, Col, Button, Typography, Table, Form, message, notification, Popconfirm, Input, InputNumber, Switch } from 'antd';
import { useEffect, useState } from 'react';
const { Title, Text } = Typography;

const Banks = () => {

    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isCreateForm, setIsCreateForm] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        getBanks(`${process.env.REACT_APP_API_URL_BASE}/banks`)
    }, []);

    const getBanks = async (url) => {
        setLoading(true);
        try {
            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
            const data = await res.json();
            let newArray = []
            data.data.map(item => {
                newArray.push({
                    key: item.id,
                    bank: item.bank,
                    discount: item.discount,
                    discount_status: item.discount_status
                })
            })
            setDataSource(newArray);
            setLoading(false);
        } catch (error) {
            message.error(error)
            console.log(error)
            setLoading(false)
        }
    }

    const handleUpdateBank = (bank) => {
        console.log("update bank", bank)
        form.setFieldsValue({
            bank: bank.bank,
            discount: bank.discount,
            discount_status: bank.discount_status
        });
        setUpdateId(bank.key);
        setIsCreateForm(false);
        setShowForm(true)
    }

    const handleCreateBank = () => {
        setShowForm(true);
        setIsCreateForm(true);
        form.resetFields();
    }

    const handleDeleteBank = async (bank) => {
        console.log("delete", bank)
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/banks/id/${bank.key}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            message.success("Banco eliminado con éxito!")
            getBanks(`${process.env.REACT_APP_API_URL_BASE}/banks`)
        } catch (error) {
            console.log(error)
        }
    }

    const cancel = (e) => {
        console.log(e)
    };

    const onFinish = (values) => {
        console.log("form finish", values)
        if(values.discount_status === undefined){
            values.discount_status = false
        }
        if (isCreateForm) {
            registerBank(values)
        } else {
            updateBankData(values)
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

    const registerBank = (value) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/banks`, {
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
                    message.success(`Banco registrada con éxito!`)
                    getBanks(`${process.env.REACT_APP_API_URL_BASE}/banks`)
                }
            })
    }

    const updateBankData = async (values) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/banks/id/${updateId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            const data = await res.json();
            message.success("Las modificaciones han sido registradas con éxito!")
            getBanks(`${process.env.REACT_APP_API_URL_BASE}/banks`)
        } catch (error) {
            console.log(error)
        }
    }


    const columns = [
        {
            title: 'Banco',
            dataIndex: 'bank',
            key: 'bank',
        },
        {
            title: 'Descuento',
            dataIndex: 'discount',
            key: 'discount',
            render: (discount) => {
                if (discount <= 0)
                    return '-';
                return discount + '%';
            }
        },
        {
            title: 'Promoción vigente',
            dataIndex: 'discount_status',
            key: 'discount_status',
            render: (discount_status) => {
                return discount_status ? "Sí" : "No"
            }
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space key={record._id}>
                    <Button type='primary' onClick={() => { handleUpdateBank(record) }}>
                        Modificar
                    </Button>
                    <Popconfirm
                        title="Estás seguro que deseas eliminar este banco?"
                        onConfirm={() => { handleDeleteBank(record) }}
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
                    ? <Space active />
                    : <>
                        <Row>
                            <Col span={12}>
                                <Title level={2}>Gestión de Bancos</Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type='primary' onClick={handleCreateBank}>Crear banco</Button>
                            </Col>
                        </Row>
                        <Table dataSource={dataSource} columns={columns} />
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
                                            label="Nombre"
                                            name="bank"
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
                                    <Col span={8}>
                                        <Form.Item
                                            label="Porcentaje de descuento"
                                            name="discount"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor ingresá el descuento!',
                                                },
                                            ]}
                                        >
                                            <InputNumber placeholder="Porcentaje de descuento" style={{ width: 200 }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Activo"
                                            name="discount_status"
                                            valuePropName="checked"
                                        >
                                            <Switch />
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

    )
}

export default Banks