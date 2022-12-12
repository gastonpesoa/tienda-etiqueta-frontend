import { useState, useEffect } from 'react'
import { Skeleton, Row, Col, Image, Table, Typography, Button, Input, message, Space, Form, Upload, Popconfirm, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Solo podés subir archivos JPG/PNG!');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //     message.error('Image must smaller than 2MB!');
    // }
    return false
    //&& isLt2M;
};

const CarouselManagement = () => {

    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newFile, setNewFile] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isCreateForm, setIsCreateForm] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        getCarousels(`${process.env.REACT_APP_API_URL_BASE}/carousel`)
    }, [])

    const onChange = async (file) => {
        setNewFile(await toBase64(file.file))
        //console.log("base64", await toBase64(file.file))
    }

    const getCarousels = async (url) => {
        setLoading(true);
        try {
            let newArray = []
            const res = await fetch(url)
            const data = await res.json();
            data.data.map(async (doc) => {
                const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/carousel/id/${doc._id}`)
                const data = await res.json()
                newArray.push({
                    key: doc._id,
                    filename: doc.filename,
                    urlAction: doc.metadata.value,
                    image: `data:image/png;base64,${data.data}`
                })
                setCarousels([...newArray]);
            })
            setLoading(false);
        } catch (error) {
            message.error(error)
            console.log(error)
        }
    }

    const columns = [
        {
            title: 'Imágen',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => (
                <Image width={100} src={record.image} />
            )
        },
        {
            title: 'Nombre',
            dataIndex: 'filename',
            width: 500,
            key: 'filename'
        },
        {
            title: 'Url destino',
            dataIndex: 'urlAction',
            key: 'urlAction'
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Popconfirm
                    title="Estás seguro que deseas eliminar esta imagen?"
                    onConfirm={() => { handleDeleteCarousel(record) }}
                    onCancel={cancel}
                    okText="Si"
                    cancelText="No"
                >
                    <Button danger>
                        Eliminar
                    </Button>
                </Popconfirm>
            )
        }
    ];

    const handleUpdateCarousel = (carousel) => {
        form.setFieldsValue({
            value: carousel.value,
            shippingCost: carousel.shippingCost
        });
        setUpdateId(carousel.key);
        setIsCreateForm(false);
        setShowForm(true)
    }

    const handleCreateCarousel = () => {
        console.log("create carousel")
        setShowForm(true);
        setIsCreateForm(true);
        form.resetFields();
    }

    const handleDeleteCarousel = async (carousel) => {
        console.log("delete", carousel)
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/carousel/${carousel.key}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            message.success("Imagen eliminada con éxito!")
            getCarousels(`${process.env.REACT_APP_API_URL_BASE}/carousel`)
        } catch (error) {
            console.log(error)
        }
    }

    const cancel = (e) => {
        console.log(e)
    };

    const onFinish = (values) => {
        values.file = newFile
        console.log("form finish", values)
        if (isCreateForm) {
            registerCarousel(values)
        } else {
            updateCarouselData(values)
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

    const registerCarousel = (value) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/carousel`, {
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
                    message.success(`Carousel registrada con éxito!`)
                    getCarousels(`${process.env.REACT_APP_API_URL_BASE}/carousel`)
                }
            })
    }

    const updateCarouselData = async (values) => {
        values.id = updateId
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/carousel`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            const data = await res.json();
            message.success("Las modificaciones han sido registradas con éxito!")
            getCarousels(`${process.env.REACT_APP_API_URL_BASE}/carousel`)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {
                loading
                    ? <Skeleton active />
                    : <>
                        <Row>
                            <Col span={12}>
                                <Title level={2}>Gestión de carrusel</Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type='primary' onClick={handleCreateCarousel}>
                                    Crear imágen
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table dataSource={carousels} columns={columns} pagination={{ pageSize: 5 }}></Table>
                            </Col>
                        </Row>
                        {
                            showForm &&
                            <>

                                <Upload
                                    maxCount={1}
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    beforeUpload={beforeUpload}
                                    onChange={onChange}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div
                                            style={{
                                                marginTop: 8,
                                            }}
                                        >
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
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
                                                name="fileName"
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
                                                label="Url Destino"
                                                name="urlAction"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Por favor ingresá la url de destino!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Url Destino" />
                                            </Form.Item>
                                        </Col>
                                        {/* <Col span={8}>

                                            <Form.Item
                                                name="file"
                                                label="Upload"
                                                valuePropName="fileList"
                                                getValueFromEvent={normFile}
                                            >

                                            </Form.Item>

                                        </Col> */}
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
                            </>
                        }
                    </>
            }
        </>
    );
}

export default CarouselManagement;