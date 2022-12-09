import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'
import { Row, Col, Typography, Tag, message, Table, Button } from 'antd';
import { formatState, formatDate } from '../Utils';
const { Title } = Typography;

const columns = [
    {
        title: 'Fecha',
        dataIndex: 'date',
        defaultSortOrder: 'descend',
        sorter: (a, b) => { 
            if (a.date > b.date)
                return 1;
            else if (a.date < b.date)
                return -1;
            return 0;
        },
        render: (date) => formatDate(date)
    },
    {
        title: 'Artículos',
        dataIndex: 'items',
        render: (items) => {
            let output = '';
            for (let i = 0; i < items.length; i++) {
                const { product, units } = items[i];
                if (i != 0) output += ', ';
                output += product.title;
                if (product.articles[0].size !== undefined) output += ` (talle ${product.articles[0].size})`;
                output += ` x${units}`;
            }
            return output;
        }
    },
    {
        title: 'Estado',
        dataIndex: 'state',
        align: 'center',
        render: (state) => {
            let { color, text } = formatState(state);
            return <Tag color={color}>
                        {text}
                    </Tag>
        },
        sorter: (a, b) => a.state.localeCompare(b.state),
        filters: [
            {
                text: 'Cancelada',
                value: 'CANCELADA',
            },
            {
                text: 'Confirmada',
                value: 'CONFIRMADA',
            },
            {
                text: 'En viaje',
                value: 'EN_VIAJE',
            },
            {
                text: 'Entrega fallida',
                value: 'ENTREGA_FALLIDA',
            },
            {
                text: 'Entregada',
                value: 'ENTREGADA',
            },
            {
                text: 'Lista para entregar',
                value: 'LISTA_PARA_ENTREGAR',
            },
            {
                text: 'Lista para retirar',
                value: 'LISTA_PARA_RETIRAR',
            },
        ],
        onFilter: (value, record) => record.state.indexOf(value) === 0,
    },
    {
        title: 'Acciones',
        dataIndex: 'key',
        render: (id) => <Button><Link to={'/order-management-detail/'+id}>Ver detalle</Link></Button>
    },
];

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/orders/all/`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({data}) => {
                if (data.length > 0) {
                    data.forEach((order) => {
                        setOrders((savedOrders) => {
                            return [
                                ...savedOrders,
                                {
                                    key: order._id,
                                    date: new Date(order.date),
                                    items: order.items,
                                    state: order.state
                                }
                            ];
                        })
                    });
                } else {
                    message.error("No hay compras para gestionar");
                }
            })
            .catch((err) => {
                console.error(err);
                message.error("Hubo un error al traer las compras, intente nuevamente más tarde");
            });
    }, []);

    return (
        <>
            <Row>
                <Col span={24}><Title level={2}>Gestión de compras</Title></Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table dataSource={orders} columns={columns}></Table>
                </Col>
            </Row>
        </>
    );
}

export default OrderManagement;