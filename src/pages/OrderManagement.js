import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Typography, Space, Tag, Card, Input, Form, Select, Radio, Empty, message, notification } from 'antd';
import { AppContext } from "../AppContext";
import DataTable from '../components/DataTable';
const { Title, Text } = Typography;

const dataSource = [
    {
        key: '1',
        date: new Date('08/10/2022'),
        article: 'Corbata',
        status: 'En viaje'
    },
    {
        key: '2',
        date: new Date('08/23/2022'),
        article: 'Pantalón Gabardina Azul',
        status: 'Confirmada'
    },
    {
        key: 'pedro',
        date: new Date('08/02/2022'),
        article: 'Camisa Azul Estampada',
        status: 'Entregada'
    },
];

const columns = [
    {
        title: 'Fecha',
        dataIndex: 'date',
        defaultSortOrder: 'descend',
        sorter: function (a, b) { 
            if (a.date > b.date)
                return 1;
            else if (a.date < b.date)
                return -1;
            return 0;
        },
        render: (data) => data.toLocaleDateString('es-ES')
    },
    {
        title: 'Artículo',
        dataIndex: 'article',
        sorter: (a, b) => a.article.localeCompare(b.article),
    },
    {
        title: 'Estado',
        dataIndex: 'status',
        //key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
        title: 'Acciones',
        dataIndex: 'key',
        render: (data) => <a href={'order-detail/'+data}>Ver detalle</a>
    },
];

const OrderManagement = () => {

    const { user, token } = useContext(AppContext);
    const navigate = useNavigate()

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/banks/valid/`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({data}) => {
                /*if (data.length > 0) {
                    data.forEach((bk) => {
                        let bankAux = {};
                        bankAux.id = bk.id;
                        bankAux.value = bk.bank;
                        bankAux.label = bk.bank;
                        bankAux.discount = bk.discount_status ? bk.discount : 0;
                        if (bk.discount !== null && bk.discount > 0 && bk.discount_status) {
                            bankAux.label += ' (-' + bk.discount + '%)' ;
                        }
                        bankList.push(bankAux);
                    });
                } else {
                    message.error("No hay bancos disponibles");
                }*/
            })
            .catch((err) => {
                console.error(err);
                message.error("Hubo un error al traer el ordenes, intente nuevamente más tarde");
            });
    }, []);

    const viewOrder = (values) => {
        /*fetch(`${process.env.REACT_APP_API_URL_BASE}/orders`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                message.error(data.message)
            } else {
                dispatchShoppingCartEvent('REMOVE_ALL');
                navigate(`../result/${data.data.id}`)
            }
        });*/
    }

    return (
        <>
            <Row>
                <Col span={24}><Title level={2}>Gestión de compras</Title></Col>
            </Row>
            <Row>
                <Col span={24}>
                    <DataTable dataSource={dataSource} columns={columns}></DataTable>
                </Col>
            </Row>
        </>
    );
}

export default OrderManagement;