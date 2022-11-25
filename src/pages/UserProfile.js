import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Typography, Skeleton, Table } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
const { Title, Text } = Typography;

const UserProfile = () => {

    const { user, dispatchUserEvent } = useContext(AppContext);
    const navigate = useNavigate()

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOrders = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                })
                const data = await res.json();
                console.log("user  orders", data.data)
                setOrders(data.data);
                setLoading(false);
            } catch (error) {
                alert(error)
            }
        }
        getOrders(`${process.env.REACT_APP_API_URL_BASE}/orders/`)
    }, [])

    const handleCloseSesion = () => {
        dispatchUserEvent('', {})
        navigate('/')
    }

    const handleUpdateUserData = () => {

    }

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
        },
        {
            title: 'Artículos',
            dataIndex: 'artículo',
            key: 'artículo',
        },
        {
            title: 'Detalle',
            dataIndex: 'detalle',
            key: 'detalle',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
        }
    ];

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    :
                    <>
                        <Row>
                            <Col span={12}><Title level={2}>Perfil de usuario</Title></Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button
                                    onClick={handleCloseSesion}
                                    type='link'
                                    icon={<LogoutOutlined style={{ fontSize: '24px', color: 'black' }} />}
                                >
                                    Cerrar sesión
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}><Text type="secondary">Sus datos de usuario</Text></Col>
                        </Row>
                        <Row className='space-margin-bottom'>
                            <Col span={24}>
                                <Button
                                    onClick={handleUpdateUserData}
                                    type="primary"
                                    size='large'
                                >
                                    Guardar modificaciones
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}><Title level={2}>Listado de compras</Title></Col>
                        </Row>
                        <Row>
                            <Col span={24}><Text type="secondary">Su historial de compras</Text></Col>
                        </Row>
                    </>
            }
        </>
    )
}

export default UserProfile