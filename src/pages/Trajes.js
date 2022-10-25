import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Typography, Badge, Space, Tag } from 'antd';
import BadgeProductsCount from "../components/BadgeProductsCount";
import FilterGender from "../components/FilterGender";
import FilterSize from "../components/FilterSize";
import FiltersApplied from "../components/FiltersApplied";
import FilterBrand from "../components/FilterBrand";
import FilterRating from "../components/FilterRating";
import FilterPrice from '../components/FilterPrice';
import Rating from '../components/Rating';
import myData from '../data.json';
import '../App.less';
const { Title, Text } = Typography;

const URL = "https://tienda-etiqueta-backend.vercel.app/api/trajes/"

const Trajes = () => {
    const { trajes } = myData;
    return (
        <>
            <Row>
                <Col span={12}><Title level={2}>Trajes</Title></Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Space>
                        <BadgeProductsCount count={trajes.length} />
                    </Space>
                </Col>
            </Row>
            <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                    <Space>
                        <FilterGender />
                        <FilterSize />
                    </Space>
                </Col>
            </Row>
            <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                    <FiltersApplied />
                </Col>
            </Row>
            <Row>
                <Col span={6}>
                    <Space direction='vertical' size='large'>
                        <FilterBrand brands={trajes.map((item) => ({ label: item.brand, value: item.brand }))} />
                        <FilterRating
                            ratings={
                                trajes.map((item) => ({
                                    label: <Rating rating={item.rating} color={'#FDBC15'} />,
                                    value: item.rating
                                }))}
                        />
                        <FilterPrice />
                    </Space>
                </Col>
                <Col span={18} style={{ border: '1px black solid' }}>

                </Col>
            </Row>
        </>
    );
}

export default Trajes;