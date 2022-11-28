import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router'
import { Col, Row, Typography, Image, Space, Radio, Card, Button, Tabs, Badge, Table, Divider, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
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
    const [review, setReview] = useState({});

    useEffect(() => {
        const getOrderById = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url)
                const data = await res.json();
                setOrder(data.data);                
                setLoading(false);
            } catch (error) {
                alert(error)
            }
        }
        getOrderById(`${process.env.REACT_APP_API_URL_BASE}/orders/${orderId}`)
    }, [orderId])    
   
    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : (<Row gutter={16}>
                        <Col span={12}>
                           
                        </Col>
                        <Col span={12}>
                           
                        
                            
                        </Col>
                    </Row>)
            }
        </>
    )
}

export default OrderDetail