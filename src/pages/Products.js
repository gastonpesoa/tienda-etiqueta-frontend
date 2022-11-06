import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Typography, Space, Skeleton } from 'antd';
import BadgeProductsCount from "../components/BadgeProductsCount";
import ProductCard from '../components/ProductCard';
import FiltersApplied from "../components/FiltersApplied";
import FilterGender from "../components/FilterGender";
import FilterSize from "../components/FilterSize";
import FilterBrand from "../components/FilterBrand";
import FilterRating from "../components/FilterRating";
import FilterPrice from '../components/FilterPrice';
import Rating from '../components/Rating';
import '../App.less';
const { Title } = Typography;

const URL = "https://tienda-etiqueta-backend.vercel.app/api/products"

const Products = () => {

    const { category, subcategory } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getProducts = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url)
                const data = await res.json();
                setProducts(data.data);
                setLoading(false);
            } catch (error) {
                alert(error)
            }
        }
        const urlBase = `${URL}/category/${category}`;
        const urlGet = `${urlBase}${subcategory ? '/subcategory/'.concat(subcategory) : ''}`
        getProducts(urlGet)
    }, [category, subcategory])

    const handleFilterRatingChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
        //products.filter(item => item.rating_average !== checkedValues);
    };

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : (<>
                        <Row>
                            <Col span={12}><Title level={2}>{category}</Title></Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Space>
                                    <BadgeProductsCount count={products.length} />
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
                                    <FilterBrand brands={products.map((item, i) => ({ id: i, label: item.brand, value: item.brand }))} />
                                    <FilterRating
                                        ratings={
                                            products.map((item, i) => ({
                                                id: i,
                                                label: <Rating rating={item.rating_average} color={'#FDBC15'} />,
                                                value: item.rating_average
                                            }))}
                                        handleFilterRatingChange={handleFilterRatingChange}
                                    />
                                    <FilterPrice />
                                </Space>
                            </Col>
                            <Col span={18}>
                                {
                                    products.map((traje, i) => (
                                        <ProductCard key={i} product={traje} />
                                    ))
                                }
                            </Col>
                        </Row>
                    </>)
            }
        </>
    );
}

export default Products;