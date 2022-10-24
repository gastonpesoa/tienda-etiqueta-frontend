import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import myData from '../data.json';
import { Row, Col, Button, Typography, Form, Input } from 'antd';
const { Title, Text } = Typography;

const URL = "https://tienda-etiqueta-backend.vercel.app/api/login/"

const Trajes = () => {
    const { trajes } = myData;
    return (
        <>
            <Row>
                <Col span={12}><Title level={2}>Trajes</Title></Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Text>Productos</Text>
                </Col>
            </Row>
        </>
    );
}

export default Trajes;