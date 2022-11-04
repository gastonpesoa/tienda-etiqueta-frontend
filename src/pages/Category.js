import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { Row, Col, Button, Typography, Image, Space, Tag, Card } from 'antd';
import BadgeProductsCount from "../components/BadgeProductsCount";
import FilterGender from "../components/FilterGender";
import FilterSize from "../components/FilterSize";
import FiltersApplied from "../components/FiltersApplied";
import FilterBrand from "../components/FilterBrand";
import FilterRating from "../components/FilterRating";
import FilterPrice from '../components/FilterPrice';
import Price from "../components/Price";
import Rating from '../components/Rating';
import myData from '../data.json';
import '../App.less';
import ProductCard from '../components/ProductCard';
const { Title, Text } = Typography;

const URL = "https://tienda-etiqueta-backend.vercel.app/api/trajes/"

const Category = () => {

    const { idCategory } = useParams();
    const { trajes } = myData;

    return (
        <>
            <Row>
                <Col span={12}><Title level={2}>{idCategory}</Title></Col>
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
                        <FilterBrand brands={trajes.map((item, i) => ({ id: i, label: item.brand, value: item.brand }))} />
                        <FilterRating
                            ratings={
                                trajes.map((item, i) => ({
                                    id: i,
                                    label: <Rating rating={item.rating_average} color={'#FDBC15'} />,
                                    value: item.rating_average
                                }))}
                        />
                        <FilterPrice />
                    </Space>
                </Col>
                <Col span={18}>
                    {
                        trajes.map((traje, i) => (
                            <ProductCard key={i} product={traje} />
                        ))
                    }
                </Col>
            </Row>
        </>
    );
}

export default Category;