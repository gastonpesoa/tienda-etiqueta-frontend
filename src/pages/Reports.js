import { useEffect, useState } from 'react';
import { Statistic, Select, Image, Row, Col, Layout, Typography, Skeleton, Space, Table } from 'antd';
import ProductSmallCard from "../components/ProductSmallCard";
import Price from "../components/Price";
import '../App.less';
const { Title, Text } = Typography;

const Reports = ({ menu }) => {

    //const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth().toString());
    const [quantityByMonth, setQuantityByMonth] = useState([]);
    const [avgByMonth, setAvgByMonth] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [bestRated, setBestRated] = useState([]);

    useEffect(() => {
        getBestSellers(`${process.env.REACT_APP_API_URL_BASE}/products/best-sellers`)
        getBestRated(`${process.env.REACT_APP_API_URL_BASE}/products/best-rated`)
    }, []);

    useEffect(() => {
        console.log(bestSellers)
    }, [bestSellers])

    useEffect(() => {
        getQuantityByMonth(`${process.env.REACT_APP_API_URL_BASE}/orders/quantity-by-month/${month}`)
        getAvgSalesByMonth(`${process.env.REACT_APP_API_URL_BASE}/orders/avg-sales-by-month/${month}`)
    }, [month])

    const handleMonthChange = (value) => {
        setMonth(value)
    };

    const getQuantityByMonth = async (url) => {
        try {
            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
            const data = await res.json();
            if (data.data.length > 0) {
                setQuantityByMonth(data.data.length + 1)
            } else {
                setQuantityByMonth(0)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getAvgSalesByMonth = async (url) => {
        try {
            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
            const data = await res.json();
            if (data.data.length > 0) {
                const formatAvg = new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 2,
                    roundingIncrement: 5,
                }
                ).format(data.data[0].salesAvg)
                setAvgByMonth(formatAvg)
            } else {
                setAvgByMonth(0)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getBestSellers = async (url) => {
        try {
            const res = await fetch(url)
            const data = await res.json();
            let newArray = []
            data.data.map(async item => {
                const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image-docs/${item._id}`)
                const data = await res.json()
                let images = []
                for (const doc of data.data) {
                    const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image/${doc._id}`)
                    const data = await res.json()
                    images.push({ fileName: doc.filename, src: `data:image/png;base64,${data.data}` })
                }
                newArray.push(item.item)
                item.item.images = images
                item.item.sales = item.ventas
                setBestSellers([...newArray]);
            })
        } catch (error) {
            console.log(error)
        }
    }
    const getBestRated = async (url) => {
        try {
            const res = await fetch(url)
            const data = await res.json()
            let newArray = []
            data.data.map(async item => {
                const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image-docs/${item._id}`)
                const data = await res.json()
                let images = []
                for (const doc of data.data) {
                    const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image/${doc._id}`)
                    const data = await res.json()
                    images.push({ fileName: doc.filename, src: `data:image/png;base64,${data.data}` })
                }
                item.images = images
                newArray.push(item)
                setBestRated([...newArray])
            })
        } catch (error) {
            console.log(error)
        }
    }

    const bestSellersColumns = [
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
            title: 'Cantidad de ventas',
            dataIndex: 'sales',
            key: 'sales'
        }
    ];

    const bestRatedColumns = [
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
        }
    ];

    return (
        <>
            {/* {
                loading ? <Skeleton active /> :
                    <>

                    </>
            } */}
            <Row gutter={16}>
                <Col span={6}>
                    <Space>
                        <Text>Seleccione el mes: </Text>
                        <Select
                            defaultValue={month}
                            style={{
                                width: 120,
                            }}
                            onChange={handleMonthChange}
                            options={[
                                {
                                    value: '0',
                                    label: 'Enero',
                                },
                                {
                                    value: '1',
                                    label: 'Febrero',
                                },
                                {
                                    value: '2',
                                    label: 'Marzo',
                                },
                                {
                                    value: '3',
                                    label: 'Abril',
                                },
                                {
                                    value: '4',
                                    label: 'Mayo',
                                },
                                {
                                    value: '5',
                                    label: 'Junio',
                                },
                                {
                                    value: '6',
                                    label: 'Julio',
                                },
                                {
                                    value: '7',
                                    label: 'Agosto',
                                },
                                {
                                    value: '8',
                                    label: 'Septiembre',
                                },
                                {
                                    value: '9',
                                    label: 'Octubre',
                                },
                                {
                                    value: '10',
                                    label: 'Noviembre',
                                },
                                {
                                    value: '11',
                                    label: 'Diciembre',
                                }
                            ]}
                        />
                    </Space>
                </Col>
                <Col span={9}>
                    <Statistic title="Ventas por mes" value={quantityByMonth} />
                </Col>
                <Col span={9}>
                    <Statistic title="Promedio de valor de ventas por mes" value={avgByMonth} precision={2} />
                </Col>
            </Row>
            <Row>
                <Title level={4}>Mejores vendidos</Title>
                <Col span={24}>
                    <Table dataSource={bestSellers} columns={bestSellersColumns} pagination={{ pageSize: 5 }} />
                </Col>
            </Row>
            <Row>
                <Title level={4}>Mejores calificados</Title>
                <Col span={24}>
                    <Table dataSource={bestRated} columns={bestRatedColumns} pagination={{ pageSize: 5 }} />
                </Col>
            </Row>
        </>
    );
}

export default Reports;