import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Typography, Space, Skeleton, Rate } from 'antd';
import BadgeProductsCount from "../components/BadgeProductsCount";
import ProductCard from '../components/ProductCard';
import FiltersApplied from "../components/FiltersApplied";
import FilterGender from "../components/FilterGender";
import FilterSize from "../components/FilterSize";
import FilterBrand from "../components/FilterBrand";
import FilterRating from "../components/FilterRating";
import FilterPrice from '../components/FilterPrice';
import '../App.less';
const { Title } = Typography;

const Products = () => {

    const { category, subcategory } = useParams();
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showGenderFilter, setShowGenderFilter] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState([]);

    useEffect(() => {
        const getProducts = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url)
                const data = await res.json();
                setProducts(data.data);
                setAllProducts(data.data);
                setLoading(false);
            } catch (error) {
                alert(error)
            }
        }
        const urlBase = `${process.env.REACT_APP_API_URL_BASE}/products/category/${category}`;
        const urlGet = `${urlBase}${subcategory ? '/subcategory/'.concat(subcategory) : ''}`
        getProducts(urlGet)
    }, [category, subcategory])

    useEffect(() => {
        const genders = [...new Set(allProducts.map(item => item.gender))];
        setShowGenderFilter(genders.length > 1)

        let articlesResult = allProducts.map(item => item.articles)
            .reduce((prev, curr) => prev.concat(curr), [])
        const sizes = [...new Set(articlesResult.map(item => item.size))];
        setSizes(sizes)

        const ratings = [...new Set(
            allProducts.filter(item => item.rating_average > 0)
                .map(item => item.rating_average)
        )];
        setRatings(ratings)
    }, [allProducts])


    useEffect(() => {

        let filterAcumulator = [...allProducts]

        filtersApplied.map(filter => {

            if (filter.type === "gender") {

                let filterResult = filterAcumulator.filter(product => product.gender === filter.value)
                filterAcumulator = [...filterResult]
                console.log("products by gender", filterResult)
                console.log("filterAcumulator after gender", filterAcumulator)

            } else if (filter.type === "size") {
                const filterResult = filterAcumulator.filter((el) => {
                    return el.articles.some(article => article.size === filter.value)
                });
                filterAcumulator = [...filterResult]
                console.log("products by size", filterResult)
                console.log("filterAcumulator after size", filterAcumulator)
            }
        })

        console.log("filterAcumulator final", filterAcumulator)
        setProducts(filterAcumulator)

    }, [filtersApplied])

    const handleFilterRatingChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
        //products.filter(item => item.rating_average !== checkedValues);
    };

    const dispatchFilterPriceApplied = (priceFilter) => {
        if (filtersApplied.some(filter => filter.type === 'price')) {
            let filteredfiltersApplied = filtersApplied.filter(item => item.type !== 'price')
            filteredfiltersApplied.push(priceFilter)
            setFiltersApplied(filteredfiltersApplied)
        } else {
            setFiltersApplied([...filtersApplied, priceFilter])
        }
        // const filteredProducts = allProducts.filter((el) => {
        //     return el.price > min && el.price < max
        // });
        // setProducts(filteredProducts)
    }

    const dispatchFilterGenderApplied = (gender) => {
        if (filtersApplied.some(filter => filter.type === 'gender')) {
            let filteredfiltersApplied = filtersApplied.filter(item => item.type !== 'gender')
            filteredfiltersApplied.push(gender)
            setFiltersApplied(filteredfiltersApplied)
        } else {
            setFiltersApplied([...filtersApplied, gender])
        }
        setShowGenderFilter(false)
    }

    const dispatchFilterSizeApplied = (size) => {
        if (!filtersApplied.some(filter => filter.value === size.value)) {
            const filteredProducts = allProducts.filter((el) => {
                return el.articles.some(article => article.size === size.value)
            });
            setFiltersApplied([...filtersApplied, size])
        }
    }

    const dispatchRemoveFilterApplied = (filter) => {
        console.log("filter removed", filter)
        let filteredfiltersApplied = filtersApplied.filter(item => item.value !== filter.value)
        setFiltersApplied(filteredfiltersApplied);
        if (filter.type === 'gender') {
            const filteredProducts = allProducts.filter((el) => {
                return el.gender === 'Mujer' || el.gender === 'Hombre'
            });
            //res = arr1.filter(item => !arr2.includes(item));
            setProducts(filteredProducts)
            setShowGenderFilter(true)
        }
        // const filteredProducts = allProducts.filter((el) => {
        //     return el.gender === gender
        // });
        // setProducts(filteredProducts)
    }

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : (<>
                        <Row>
                            <Col span={12}><Title level={2}>{category.charAt(0).toUpperCase() + category.slice(1)}</Title></Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <BadgeProductsCount count={products.length} />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 16 }}>
                            <Col span={24}>
                                <Space>
                                    {
                                        showGenderFilter &&
                                        <FilterGender dispatchFilterGenderApplied={dispatchFilterGenderApplied} />
                                    }
                                    <FilterSize sizes={sizes} dispatchFilterSizeApplied={dispatchFilterSizeApplied} />
                                </Space>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 16 }}>
                            <Col span={24}>
                                <FiltersApplied filters={filtersApplied} dispatchRemoveFilterApplied={dispatchRemoveFilterApplied} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Space direction='vertical' size='large'>
                                    <FilterBrand brands={products.map((item, i) => ({ id: i, label: item.brand, value: item.brand }))} />
                                    {
                                        ratings.length > 0 &&
                                        <FilterRating
                                            ratings={
                                                ratings.map((item, i) => ({
                                                    id: i,
                                                    label: <Rate defaultValue={item} disabled />,
                                                    value: item
                                                }))}
                                            handleFilterRatingChange={handleFilterRatingChange}
                                        />
                                    }
                                    <FilterPrice dispatchFilterPriceApplied={dispatchFilterPriceApplied} />
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