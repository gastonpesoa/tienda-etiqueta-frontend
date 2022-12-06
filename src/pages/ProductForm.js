import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { Col, Row, Button, Typography, Form, Input, Select, InputNumber, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import myData from '../data.json';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
const { Option } = Select;
const { Title } = Typography;

/*const fileList = [
    {
      uid: '0',
      name: 'xxx.png',
      status: 'uploading',
      percent: 33,
    },
    {
      uid: '-1',
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'zzz.png',
      status: 'error',
    },
];*/

const ProductForm = () => {

    const navigate = useNavigate()
    const [categoriesList, setCategoriesList] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/categories/`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({ data }) => {
                if (data.length > 0) {
                    data.forEach((category) => {
                        setCategoriesList((savedCategories) => {
                            return [
                                ...savedCategories,
                                {
                                    id: category._id,
                                    value: category.name,
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
    }, []);

    const onFinish = (values) => {
        createProduct(values)
    };

    const onFinishFailed = (errorInfo) => {
        console.error('Failed:', errorInfo);
    };

    const createProduct = (value) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/products`, {
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
                    message.success(`Producto creado exitosamente!`)
                    navigate('/')
                }
            })
    }

    return (
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
            <Row>
                <Col span={24}>
                    <Form.Item>
                        <Title level={3} >Crear artículo</Title>
                        <Title level={5} type="secondary">Introduzca los datos del artículo</Title>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Row gutter={8}>
                        <Col span={24}>
                            <Form.Item
                                label="Título"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingresá el título del artículo!',
                                    },
                                ]}
                            >
                                <Input placeholder="Ingrese el título del artículo" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                name="category"
                                label="Categoría"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor seleccione la categoría del artículo!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Seleccione una categoría"
                                    allowClear
                                    options={null}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="subcategory"
                                label="Sub-categoría"
                                rules={[
                                    {
                                        message: 'Por favor seleccione la sub-categoría del artículo!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Seleccione una sub-categoría"
                                    allowClear
                                    options={null}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label="Marca"
                                name="brand"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingresá la marca del artículo!',
                                    },
                                ]}
                            >
                                <Input placeholder="Ingrese la marca del artículo" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Color"
                                name="color"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingresá el color del artículo!',
                                    },
                                ]}
                            >
                                <Input placeholder="Ingrese el color del artículo" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label="Precio"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingresá el precio del artículo!',
                                    },
                                ]}
                            >
                                <InputNumber 
                                    placeholder="Ingrese el precio del artículo" 
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="gender"
                                label="Género"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor seleccione el género del artículo!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Seleccione un género"
                                    allowClear
                                    options={[
                                        {
                                            value: 'M'
                                        },
                                        {
                                            value: 'F'
                                        }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label="Descripción"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingresá la descripción del artículo!',
                                    },
                                ]}
                            >
                                <TextArea rows={3} placeholder="Ingrese la descripción del artículo" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Detalle"
                                name="detail"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor ingresá el detalle del artículo!',
                                    },
                                ]}
                            >
                                <TextArea rows={3} placeholder="Ingrese el detalle del artículo" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size='large' style={{ marginRight: '8px' }}>
                            Crear artículo
                        </Button>
                        <Link to="/">
                            <Button
                                type="default"
                                size='large'
                            >
                                Cancelar
                            </Button>
                        </Link>
                    </Form.Item>
                </Col>
                {/*<Col span={12} style={{ padding: '30px 0px 0px 30px', textAlign: 'center' }}>
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture"
                        defaultFileList={[...fileList]}
                    >
                        <Button icon={<UploadOutlined />} size='large'>Subir imagen</Button>
                    </Upload>
                </Col>*/}
            </Row>
        </Form>
    );
}

export default ProductForm;