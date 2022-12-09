import { useState, useEffect } from 'react'
import { Skeleton, Row, Col, Table, Typography, Button, Input, message, Space, Form, InputNumber, DatePicker, Popconfirm, notification, Switch } from 'antd';
import moment from 'moment';
import Price from "../components/Price";
import { formatDate } from '../Utils'
const { Title, Text } = Typography;

const DiscountCodeManagement = () => {

    const [dicounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isCreateForm, setIsCreateForm] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        getDiscounts(`${process.env.REACT_APP_API_URL_BASE}/discountCodes`)
    }, [])

    const getDiscounts = async (url) => {
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
                    code: item.code,
                    amount: item.amount,
                    used: item.used,
                    due_date: item.due_date,
                    created_by: item.created_by
                })
            })
            setDiscounts(newArray);
            setLoading(false);
        } catch (error) {
            message.error(error)
            console.log(error)
        }
    }

    const handleUpdateDiscount = (item) => {
        form.setFieldsValue({
            code: item.code,
            amount: item.amount,
            used: item.used,
            due_date: moment(item.due_date),
            created_by: item.created_by
        });
        setUpdateId(item.key);
        setIsCreateForm(false);
        setShowForm(true)
    }

    const handleCreateDiscount = () => {
        console.log("create discount")
        setShowForm(true);
        setIsCreateForm(true);
        form.resetFields();
    }

    const handleDeleteDiscount = async (discount) => {
        console.log("delete", discount)
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/discountCodes/id/${discount.key}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            message.success("Descuento eliminada con éxito!")
            getDiscounts(`${process.env.REACT_APP_API_URL_BASE}/discountCodes`)
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
            registerDiscount(values)
        } else {
            updateDiscountData(values)
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

    const registerDiscount = (value) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/discountCodes`, {
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
                    message.success(`Descuento registrada con éxito!`)
                    getDiscounts(`${process.env.REACT_APP_API_URL_BASE}/discountCodes`)
                }
            })
    }

    const updateDiscountData = async (values) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/discountCodes/id/${updateId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            const data = await res.json();
            message.success("Las modificaciones han sido registradas con éxito!")
            getDiscounts(`${process.env.REACT_APP_API_URL_BASE}/discountCodes`)
        } catch (error) {
            console.log(error)
        }
    }

    const columns = [
        {
            title: 'Código',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: 'Descuento',
            dataIndex: 'amount',
            key: 'amount',
            render: (_, record) => (
                <Price key={record.key} price={record.amount} isText={true} />
            )
        },
        {
            title: 'Utilizado',
            dataIndex: 'used',
            key: 'used',
            render: (_, record) => (
                record.used ? "Sí" : "No"
            )
        },
        {
            title: 'Fecha de vencimiento',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (_, record) => (
                <Text key={record.key}>{formatDate(record.due_date)}</Text>
            )
        },
        {
            title: 'Creado por',
            dataIndex: 'created_by',
            key: 'created_by'
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space key={record._id}>
                    <Button type='primary' onClick={() => { handleUpdateDiscount(record) }}>
                        Modificar
                    </Button>
                    <Popconfirm
                        title="Estás seguro que deseas eliminar este descuento?"
                        onConfirm={() => { handleDeleteDiscount(record) }}
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
                                <Title level={2}>Gestión de descuentos</Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type='primary' onClick={handleCreateDiscount}>
                                    Crear descuento
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table dataSource={dicounts} columns={columns} pagination={{ pageSize: 5 }}></Table>
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
                                    <Col span={6}>
                                        <Form.Item
                                            label="Código"
                                            name="code"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor ingresá el código!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Código" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Descuento"
                                            name="amount"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor ingresá el monto del descuento!',
                                                },
                                            ]}
                                        >
                                            <InputNumber placeholder="Monto del descuento" style={{ width: 200 }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Utilizado"
                                            name="used"
                                            valuePropName="checked"
                                        >
                                            <Switch />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Fecha de vencimiento"
                                            name="due_date"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor ingresá la fecha de vencimiento!',
                                                },
                                            ]}
                                        >
                                            <DatePicker format={'DD/MM/YYYY'} />
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

export default DiscountCodeManagement;