import { useState, useEffect } from 'react'
import { Skeleton, Row, Col, Table, Typography, Button, Input, message, Space, Form, InputNumber, Popconfirm, notification } from 'antd';
import Price from "../components/Price";
const { Title, Text } = Typography;

const ZoneManagement = () => {

    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isCreateForm, setIsCreateForm] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        getZones(`${process.env.REACT_APP_API_URL_BASE}/provinces`)
    }, [])

    const getZones = async (url) => {
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
                    value: item.value,
                    shippingCost: item.shippingCost
                })
            })
            setZones(newArray);
            setLoading(false);
        } catch (error) {
            message.error(error)
            console.log(error)
        }
    }

    const handleUpdateZone = (zone) => {
        form.setFieldsValue({
            value: zone.value,
            shippingCost: zone.shippingCost
        });
        setUpdateId(zone.key);
        setIsCreateForm(false);
        setShowForm(true)
    }

    const handleCreateZone = () => {
        console.log("create zone")
        setShowForm(true);
        setIsCreateForm(true);
        form.resetFields();
    }

    const handleDeleteZone = async (zone) => {
        console.log("delete", zone)
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/provinces/${zone.key}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            message.success("Zona eliminada con éxito!")
            getZones(`${process.env.REACT_APP_API_URL_BASE}/provinces`)
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
            registerZone(values)
        } else {
            updateZoneData(values)
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

    const registerZone = (value) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/provinces`, {
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
                    message.success(`Zona registrada con éxito!`)
                    getZones(`${process.env.REACT_APP_API_URL_BASE}/provinces`)
                }
            })
    }

    const updateZoneData = async (values) => {
        values.id = updateId
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/provinces`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            const data = await res.json();
            message.success("Las modificaciones han sido registradas con éxito!")
            getZones(`${process.env.REACT_APP_API_URL_BASE}/provinces`)
        } catch (error) {
            console.log(error)
        }
    }

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'value',
            width: 500,
            key: 'value'
        },
        {
            title: 'Costo de envío',
            dataIndex: 'shippingCost',
            key: 'shippingCost',
            width: 500,
            render: (_, record) => (
                <Price key={record._id} price={record.shippingCost} isText={true} />
            )
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space key={record._id}>
                    <Button type='primary' onClick={() => { handleUpdateZone(record) }}>
                        Modificar
                    </Button>
                    <Popconfirm
                        title="Estás seguro que deseas eliminar este zona?"
                        onConfirm={() => { handleDeleteZone(record) }}
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
                                <Title level={2}>Gestión de zonas</Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type='primary' onClick={handleCreateZone}>
                                    Crear zona
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table dataSource={zones} columns={columns} pagination={{ pageSize: 5 }}></Table>
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
                                            name="value"
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
                                            label="Costo de envío"
                                            name="shippingCost"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Por favor ingresá el costo de envío!',
                                                },
                                            ]}
                                        >
                                            <InputNumber placeholder="Costo de envío" style={{ width: 200 }} />
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

export default ZoneManagement;