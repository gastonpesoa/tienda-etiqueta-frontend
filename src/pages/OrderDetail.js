import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import { Col, Row, Typography, Image, Space, Radio, Card, Button, Tabs, Badge, Table, Divider, Skeleton, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
import { formatState, formatDate } from '../Utils'
import Price from "../components/Price";
import UnitsSelect from "../components/UnitsSelect";
import Rating from '../components/Rating';
const { Title, Text, Paragraph } = Typography;

const OrderDetail = () => {

    const navigate = useNavigate();
    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const {
        id, date, state, last_update_date, items, card, billing, delivery_method
    } = order;
    const [loading, setLoading] = useState(true);
    const [orderStateColor, setOrderStateColor] = useState('');
    const [orderStateText, setOrderStateText] = useState('');
    const [orderStateDescription, setOrderStateDescription] = useState('');
    const [review, setReview] = useState({});

    useEffect(() => {
        const getOrderById = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                })
                const data = await res.json();
                if (data.error) {
                    console.log("data.error", data.error)
                    message.error("Algo salió mal, por favor ingrese e intentelo nuevamente")
                    navigate('/')
                    return
                }
                setOrder(data.data);
                setLoading(false);
            } catch (error) {
                alert(error)
            }
        }
        getOrderById(`${process.env.REACT_APP_API_URL_BASE}/orders/${orderId}`)
    }, [orderId])

    useEffect(() => {
        if (!state) {
            return
        }
        let { color, text, description } = formatState(state)
        setOrderStateColor(color)
        setOrderStateText(text)
        setOrderStateDescription(` - ${description} ${formatDate(last_update_date)}`)
    }, [order])

    const orderStateStyle = {
        color: orderStateColor
    }

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : (<Row gutter={4}>
                        <Col span={14}>
                            <Row>
                                <Col span={24}>
                                    <Title level={2}>Información de la compra</Title>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Text strong style={orderStateStyle}>
                                        {orderStateText}
                                    </Text>
                                    <Text>{orderStateDescription}</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={10}>

                        </Col>
                    </Row>)
            }
        </>
    )
}

export default OrderDetail