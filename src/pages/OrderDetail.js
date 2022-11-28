import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router'
import { Col, Row, Typography, Image, Space, Radio, Card, Button, Tabs, Badge, Table, Divider, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
import { formatState } from '../Utils'
import Price from "../components/Price";
import UnitsSelect from "../components/UnitsSelect";
import Rating from '../components/Rating';
const { Title, Text, Paragraph } = Typography;

const OrderDetail = () => {

    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const {
        id, date, state, items, card, billing, delivery_method
    } = order;
    const [loading, setLoading] = useState(true);
    const [orderStateColor, setOrderStateColor] = useState('');
    const [orderStateText, setOrderStateText] = useState('');
    const [review, setReview] = useState({});

    useEffect(() => {
        const getOrderById = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                })
                const data = await res.json();
                setOrder(data.data);
                setLoading(false);
            } catch (error) {
                alert(error)
            }
        }
        getOrderById(`${process.env.REACT_APP_API_URL_BASE}/orders/${orderId}`)
    }, [orderId])

    useEffect(() => {
        let { color, text } = formatState(state)
        setOrderStateColor(color)
        setOrderStateText(text)
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
                                    <Title level={4} style={orderStateStyle}>
                                        {orderStateText}
                                    </Title>
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