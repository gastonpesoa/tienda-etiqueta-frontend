import { Link } from 'react-router-dom';
import { Col, Row, Button, Typography, Form, Image, Input, Select, InputNumber, message, Upload, notification, Popconfirm, Space, Skeleton, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import Article from '../components/Article';
import Price from '../components/Price';
import { toBase64 } from '../Utils'
const { Option } = Select;
const { Title } = Typography;

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

const ProductManagement = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isCreateForm, setIsCreateForm] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [form] = Form.useForm();
    const [categoriesList, setCategoriesList] = useState([]);
    const [subcategoriesList, setSubcategoriesList] = useState([]);
    const [articlesAmount, setArticlesAmout] = useState(1);
    const [files, setFiles] = useState([]);
    const [defaultFileList, setDefaultFileList] = useState([]);

    useEffect(() => {
        getProducts();
        getCategories();
    }, []);

    useEffect(() => {
        console.log("products", products)
    }, [products]);

    const handleUploadChange = async (files) => {
        console.log("files change", files)
        let newArray = []
        await files.fileList.map(async image => {
            let file
            try {
                file = await toBase64(image.originFileObj)
            } catch (error) {
                console.log("error", error)
            } finally {
                newArray.push({ fileName: image.name, file: file })
            }
        })
        setFiles(newArray)
        setDefaultFileList(files.fileList)
    }

    const onChangeCategory = (idCategory) => {
        getSubcategories(idCategory);
    };

    const getProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/all`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
            const data = await res.json();
            let newArray = []
            console.log(data.data);
            data.data.map(async item => {
                let newProduct = {
                    key: item._id,
                    articles: item.articles,
                    brand: item.brand,
                    category: item.category,
                    color: item.color,
                    cut: item.cut,
                    description: item.description,
                    detail: item.detail,
                    gender: item.gender,
                    price: item.price,
                    subcategory: item.subcategory,
                    title: item.title
                }
                const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image-docs/${item._id}`)
                const data = await res.json()
                let images = []
                for (const doc of data.data) {
                    const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image/${doc._id}`)
                    const data = await res.json()
                    images.push({ fileName: doc.filename, src: `data:image/png;base64,${data.data}` })
                }
                newProduct.images = images
                newArray.push(newProduct)
                setProducts([...newArray]);
                setLoading(false);
            })
        } catch (error) {
            message.error(error)
            console.error(error)
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

    const getSubcategories = (idCategory) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/subcategories/category/${idCategory}`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({ data }) => {
                setSubcategoriesList([]);
                if (data.length > 0) {
                    data.forEach((subcategory) => {
                        setSubcategoriesList((savedSubcategories) => {
                            return [
                                ...savedSubcategories,
                                {
                                    id: subcategory.id,
                                    value: subcategory.id,
                                    label: subcategory.name
                                }
                            ];
                        })
                    });
                } /*else {
                message.error("No hay subcategorías disponibles");
            }*/
            })
            .catch((err) => {
                console.error(err);
                message.error("Hubo un error al traer el listado de subcategorías, intente nuevamente más tarde");
            });
    }

    const onFinish = (values) => {
        const articles = [];
        for (let i = 1; i <= articlesAmount; i++) {
            articles.push({
                size: values[`size${i}`],
                stock: values[`stock${i}`]
            })
        }
        values.articles = articles;
        values.files = files
        if (isCreateForm)
            createProduct(values);
        else
            updateProduct(values);
    };

    const onFinishFailed = (errorInfo) => {
        console.error('Failed:', errorInfo);
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

    const createProduct = (value) => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/products`, {
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
                    message.success(`Artículo creado exitosamente!`)
                    getProducts()
                }
            })
    }

    const updateProduct = async (values) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/id/${updateId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            const data = await res.json();
            message.success("Las modificaciones han sido registradas con éxito!")
            getProducts()
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddArticle = () => {
        setArticlesAmout(articlesAmount + 1);
    }

    const handleRemoveArticle = () => {
        if (articlesAmount > 1)
            setArticlesAmout(articlesAmount - 1);
    }

    const handleCreateProduct = () => {
        setShowForm(true);
        setIsCreateForm(true);
        form.resetFields();
    }

    const handleUpdateProduct = (item) => {
        getSubcategories(item.category._id);
        console.log(item);
        setArticlesAmout(item.articles.length);
        form.setFieldsValue({
            title: item.title,
            price: item.price,
            categoryId: item.category._id,
            subcategoryId: item.subcategory ? item.subcategory._id : null,
            brand: item.brand,
            color: item.color,
            cut: item.cut,
            gender: item.gender,
            description: item.description,
            detail: item.detail,
        });
        for (let i = 0; i < item.articles.length; i++) {
            form.setFieldValue(`size${i + 1}`, item.articles[i].size);
            form.setFieldValue(`stock${i + 1}`, item.articles[i].stock);
        }
        setDefaultFileList(item.images.map((image, i) => {
            return {
                uid: i,
                name: image.fileName,
                url: image.src,
            }
        }))
        // setFiles(item.images.map(image => {
        //     return {
        //         fileName: image.fileName,
        //         file: image.src,
        //     }
        // }))
        setUpdateId(item.key);
        setIsCreateForm(false);
        setShowForm(true)
    }

    const handleDeleteProduct = async (discount) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/id/${discount.key}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            message.success("Artículo eliminado con éxito!")
            getProducts()
        } catch (error) {
            console.log(error)
        }
    }

    const cancel = (e) => {
        console.log(e)
    };

    const columns = [
        {
            title: 'Imágen',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => (
                <Image width={100} src={record.images[0]?.src} alt={record.images[0]?.fileName} />
            )
        },
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Categoría / Subcategoría',
            dataIndex: 'category',
            key: 'category',
            render: (_, record) => {
                let retorno = record.category.name
                if (record.subcategory !== undefined && record.subcategory !== null)
                    retorno += record.subcategory.name && ` / ${record.subcategory.name}`
                return retorno;
            }
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => (
                <Price key={record.key} price={record.price} isText={true} />
            )
        },
        {
            title: 'Género',
            dataIndex: 'gender',
            key: 'gender'
        },
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color'
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Space key={record._id}>
                    <Button type='primary' onClick={() => { handleUpdateProduct(record) }}>
                        Modificar
                    </Button>
                    <Popconfirm
                        title="Estás seguro que deseas eliminar este artículo?"
                        onConfirm={() => { handleDeleteProduct(record) }}
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
                                <Title level={2}>Gestión de artículos</Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type='primary' onClick={handleCreateProduct}>
                                    Crear artículo
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table dataSource={products} columns={columns} pagination={{ pageSize: 5 }}></Table>
                            </Col>
                        </Row>
                        {
                            showForm &&
                            <Form
                                layout="vertical"
                                name="basic"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                                form={form}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Form.Item>
                                            <Title level={3} >
                                                {
                                                    isCreateForm ? 'Crear artículo' : 'Modificar artículo'
                                                }
                                            </Title>
                                            <Title level={5} type="secondary">Introduzca los datos del artículo</Title>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item>
                                            <Title level={5} type="secondary" style={{ paddingTop: '51px', paddingLeft: '30px' }}>Gestión del stock</Title>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={12}>
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
                                        </Row>
                                        <Row gutter={8}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="categoryId"
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
                                                        onChange={onChangeCategory}
                                                        options={categoriesList}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="subcategoryId"
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
                                                        options={subcategoriesList}
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
                                                    label="Corte"
                                                    name="cut"
                                                >
                                                    <Input placeholder="Ingrese el corte del artículo" />
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
                                                                value: 'Hombre'
                                                            },
                                                            {
                                                                value: 'Mujer'
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
                                        <Row>
                                            <Col span={12}>
                                                <Upload
                                                    maxCount={3}
                                                    fileList={defaultFileList}
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    beforeUpload={beforeUpload}
                                                    onChange={handleUploadChange}
                                                >
                                                    <div>
                                                        <PlusOutlined />
                                                        <div
                                                            style={{
                                                                marginTop: 8,
                                                            }}
                                                        >
                                                            Subir imágenes
                                                        </div>
                                                    </div>
                                                </Upload>
                                            </Col>
                                        </Row>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                                                {
                                                    isCreateForm ? 'Crear artículo' : 'Guardar modificaciones'
                                                }
                                            </Button>
                                            <Button
                                                danger
                                                onClick={() => setShowForm(false)}
                                            >
                                                Cancelar
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} style={{ paddingLeft: '30px', textAlign: 'center' }}>
                                        {
                                            (function (rows, i, len) {
                                                while (++i <= len) {
                                                    rows.push(<Article articleNumber={i - 1} />)
                                                }
                                                return rows;
                                            })
                                                ([], 1, articlesAmount + 1)
                                        }
                                        <Row align='center'>
                                            <Button
                                                type="primary"
                                                size='large'
                                                onClick={handleAddArticle}
                                            >
                                                Agregar talle
                                            </Button>
                                            {
                                                articlesAmount > 1 &&
                                                <Button
                                                    type="default"
                                                    size='large'
                                                    onClick={handleRemoveArticle}
                                                    style={{ marginLeft: '8px' }}
                                                >
                                                    Remover talle
                                                </Button>
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </Form>
                        }
                    </>
            }
        </>
    );
}

export default ProductManagement;