import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Typography, Space, Skeleton, Rate, Empty } from 'antd';
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

    const { category, subcategory, query } = useParams();
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [showGenderFilter, setShowGenderFilter] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [brands, setBrands] = useState([]);
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

        let urlGet = ""
        if (query) {
            urlGet = `${process.env.REACT_APP_API_URL_BASE}/products/search/${query}`
            setTitle(`Resultados para ${query}`)
        } else {
            const urlBase = `${process.env.REACT_APP_API_URL_BASE}/products/category/${category}`;
            urlGet = `${urlBase}${subcategory ? '/subcategory/'.concat(subcategory) : ''}`
            setTitle(category.charAt(0).toUpperCase() + category.slice(1))
        }
        getProducts(urlGet)

    }, [category, subcategory, query])

    useEffect(() => {
        const genders = [...new Set(allProducts?.map(item => item.gender))];
        setShowGenderFilter(genders.length > 1)
        const brands = [...new Set(allProducts?.map(item => item.brand))];
        setBrands(brands)
        let articlesResult = allProducts?.map(item => item.articles)
            .reduce((prev, curr) => prev.concat(curr), [])
        const sizes = [...new Set(articlesResult?.map(item => item.size))];
        setSizes(sizes)
        const ratings = [...new Set(
            allProducts?.filter(item => item.rating_average > 0)
                .map(item => Math.floor(item.rating_average))
        )];
        setRatings(ratings)
    }, [allProducts])

    useEffect(() => {
        let productsFilteredAcumulator = [...allProducts]
        const sizeFilters = filtersApplied
            .filter(filter => filter.type === 'size')
            .map(filter => filter.value)
        const brandFilters = filtersApplied
            .filter(filter => filter.type === 'brand')
            .map(filter => filter.value)
        const rateFilters = filtersApplied
            .filter(filter => filter.type === 'rate')
            .map(filter => filter.value)
        if (brandFilters.length > 0) {
            const filterBrandResult = productsFilteredAcumulator.filter(product =>
                brandFilters.includes(product.brand)
            );
            productsFilteredAcumulator = [...filterBrandResult]
        }
        if (sizeFilters.length > 0) {
            const filterSizeResult = productsFilteredAcumulator.filter(product =>
                product.articles.some(article => sizeFilters.includes(article.size))
            );
            productsFilteredAcumulator = [...filterSizeResult]
        }
        if (rateFilters.length > 0) {
            const filterSizeResult = productsFilteredAcumulator.filter(product =>
                rateFilters.includes(Math.floor(product.rating_average))
            );
            productsFilteredAcumulator = [...filterSizeResult]
        }
        filtersApplied.map(filter => {
            if (filter.type === "gender") {
                const filterResult = productsFilteredAcumulator.filter(product => product.gender === filter.value)
                productsFilteredAcumulator = [...filterResult]
            } else if (filter.type === "price") {
                const filterResult = productsFilteredAcumulator.filter(product =>
                    product.price > filter.minValue && product.price < filter.maxValue
                );
                productsFilteredAcumulator = [...filterResult]
            }
        })
        setProducts(productsFilteredAcumulator)
    }, [filtersApplied])

    const dispatchFilterPriceApplied = (priceFilter) => {
        if (filtersApplied.some(filter => filter.type === 'price')) {
            let filteredFiltersApplied = filtersApplied.filter(item => item.type !== 'price')
            filteredFiltersApplied.push(priceFilter)
            setFiltersApplied(filteredFiltersApplied)
        } else {
            setFiltersApplied([...filtersApplied, priceFilter])
        }
    }

    const dispatchFilterGenderApplied = (genderFilter) => {
        if (filtersApplied.some(filter => filter.type === 'gender')) {
            let filteredFiltersApplied = filtersApplied.filter(item => item.type !== 'gender')
            filteredFiltersApplied.push(genderFilter)
            setFiltersApplied(filteredFiltersApplied)
        } else {
            setFiltersApplied([...filtersApplied, genderFilter])
        }
        setShowGenderFilter(false)
    }

    const dispatchFilterSizeApplied = (sizeFilter) => {
        if (!filtersApplied.some(filter => filter.value === sizeFilter.value)) {
            setFiltersApplied([...filtersApplied, sizeFilter])
        }
    }

    const dispatchFilterBrandApplied = (brandFilter) => {
        let filteredFiltersApplied = filtersApplied.filter(item => item.type !== "brand")
        brandFilter.value.map(brand => {
            filteredFiltersApplied.push({ type: brandFilter.type, value: brand })
        })
        setFiltersApplied(filteredFiltersApplied)
    }

    const dispatchFilterRatingApplied = (rateFilter) => {
        console.log('checked = ', rateFilter);
        let filteredFiltersApplied = filtersApplied.filter(item => item.type !== "rate")
        rateFilter.value.map(rate => {
            filteredFiltersApplied.push({ type: rateFilter.type, value: rate })
        })
        setFiltersApplied(filteredFiltersApplied)
        //products.filter(item => item.rating_average !== checkedValues);
    };

    const dispatchRemoveFilterApplied = (filter) => {
        let filteredFiltersApplied = []
        if (filter.type === "gender") {
            filteredFiltersApplied = filtersApplied.filter(item => item.type !== 'gender')
            setShowGenderFilter(true)
        } else if (filter.type === "size") {
            filteredFiltersApplied = filtersApplied.filter(item => item.value !== filter.value)
        } else if (filter.type === "price") {
            filteredFiltersApplied = filtersApplied.filter(item => item.type !== 'price')
        }
        setFiltersApplied([...filteredFiltersApplied]);
    }

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : (
                        products?.length > 0
                            ? <>
                                <Row>
                                    <Col span={12}><Title level={2}>{title}</Title></Col>
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
                                            <FilterBrand
                                                brands={brands.map((brand, i) => ({
                                                    id: i, label: brand, value: brand
                                                }))}
                                                dispatchFilterBrandApplied={dispatchFilterBrandApplied}
                                            />
                                            <FilterRating
                                                ratings={
                                                    ratings.map((rate, i) => ({
                                                        id: i,
                                                        label: <Rate defaultValue={rate} disabled />,
                                                        value: rate
                                                    }))}
                                                dispatchFilterRatingApplied={dispatchFilterRatingApplied}
                                            />
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
                            </>
                            : <Empty
                                imageStyle={{
                                    marginTop: 160,
                                }}
                                description={
                                    <span>
                                        No encontramos resultados para su búsqueda
                                    </span>
                                }
                            />
                    )
            }
        </>
    );
}

export default Products;