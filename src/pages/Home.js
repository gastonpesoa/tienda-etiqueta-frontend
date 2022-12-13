import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Carousel, Image, Row, Col, Layout, Typography, Skeleton } from 'antd';
import ProductSmallCard from "../components/ProductSmallCard";
import LinksGroup from "../components/LinksGroup";
import InfoCard from "../components/InfoCard";
import '../App.less';
const { Content } = Layout;
const { Text } = Typography;

const Home = ({ menu }) => {

    const navigate = useNavigate()
    const [loadingCarousel, setLoadingCarousel] = useState(true);
    const [loadingBestSellers, setLoadingBestSellers] = useState(true);
    const [loadingBestSuits, setLoadingBestSuits] = useState(true);
    const [currentPromotions, setCurrentPromotions] = useState([]);
    const [carousel, setCarousel] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [bestSuits, setBestSuits] = useState([]);

    useEffect(() => {
        const getCarousel = async (url) => {
            setLoadingCarousel(true)
            try {
                let newArray = []
                const res = await fetch(url)
                const data = await res.json();
                data.data.map(async (doc) => {
                    const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/carousel/id/${doc._id}`)
                    const data = await res.json()
                    newArray.push({
                        key: doc._id,
                        filename: doc.filename,
                        link: doc.metadata.value,
                        src: `data:image/png;base64,${data.data}`
                    })
                    setCarousel([...newArray]);
                })
                setLoadingCarousel(false);
            } catch (error) {
                console.log(error)
            }
        }
        const getBestSellers = async (url) => {
            setLoadingBestSellers(true);
            try {
                const res = await fetch(url)
                const data = await res.json();
                let newArray = []
                data.data.map(async item => {
                    let newProduct = {
                        _id: item.item._id,
                        articles: item.item.articles,
                        brand: item.item.brand,
                        category: item.item.category,
                        color: item.item.color,
                        cut: item.item.cut,
                        description: item.item.description,
                        detail: item.item.detail,
                        gender: item.item.gender,
                        price: item.item.price,
                        subcategory: item.item.subcategory,
                        title: item.item.title,
                        reviews: item.item.reviews,
                        rating_average: item.item.rating_average
                    }
                    const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image-docs/${item._id}`)
                    const data = await res.json()
                    let images = []
                    for (const doc of data.data) {
                        const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image/${doc._id}`)
                        const data = await res.json()
                        images.push({ fileName: doc.filename, src: `data:image/png;base64,${data.data}` })
                    }
                    newProduct.images = images
                    newArray.push(newProduct)
                    setBestSellers([...newArray]);
                    setLoadingBestSellers(false);
                })
            } catch (error) {
                alert(error)
            }
        }
        const getBestSuits = async (url) => {
            setLoadingBestSuits(true);
            try {
                const res = await fetch(url)
                const data = await res.json();
                let newArray = []
                console.log(data.data);
                data.data.map(async item => {
                    let newProduct = {
                        _id: item._id,
                        articles: item.articles,
                        brand: item.brand,
                        category: item.category,
                        color: item.color,
                        cut: item.cut,
                        description: item.description,
                        detail: item.detail,
                        gender: item.gender,
                        price: item.price,
                        subcategory: item.subcategory,
                        title: item.title,
                        reviews: item.reviews,
                        rating_average: item.rating_average
                    }
                    const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image-docs/${item._id}`)
                    const data = await res.json()
                    let images = []
                    for (const doc of data.data) {
                        const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/products/image/${doc._id}`)
                        const data = await res.json()
                        images.push({ fileName: doc.filename, src: `data:image/png;base64,${data.data}` })
                    }
                    newProduct.images = images
                    newArray.push(newProduct)
                    setBestSuits([...newArray]);
                    setLoadingBestSuits(false);
                })
            } catch (error) {
                alert(error)
            }
        }

        fetch(`${process.env.REACT_APP_API_URL_BASE}/banks/valid/`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({ data }) => {
                if (data.length > 0) {
                    data.forEach((bk) => {
                        if (bk.discount !== null && bk.discount > 0 && bk.discount_status)
                            currentPromotions.push(bk);
                    });
                    setCurrentPromotions([...currentPromotions]);
                }
            })
            .catch((err) => {
                console.error(err);
            });
        getCarousel(`${process.env.REACT_APP_API_URL_BASE}/carousel`)
        getBestSellers(`${process.env.REACT_APP_API_URL_BASE}/products/best-sellers`)
        getBestSuits(`${process.env.REACT_APP_API_URL_BASE}/products/best/trajes`)
    }, []);

    return (
        <>
            <div className='carousel-container-style'>
                {
                    loadingCarousel ? <Skeleton active /> :
                        <Carousel autoplay>
                            {
                                carousel.map((img, i) => (
                                    <Image
                                        key={i}
                                        src={img.src}
                                        alt={img.filename}
                                        className='carousel-img'
                                        preview={false}
                                        onClick={() => { navigate(img.link) }}
                                    />
                                ))
                            }
                        </Carousel>
                }
            </div>
            <Content style={{ padding: '0 50px' }} >
                <Row gutter={16} className='space-margin-bottom'>
                    <Col sm={24} lg={6} >
                        <LinksGroup
                            title="Categorías principales"
                            items={menu.map((item, i) => {
                                return { title: item.title, link: item.link }
                            })}
                        />
                    </Col>
                    <Col sm={24} lg={9} >
                        <InfoCard
                            title="Tarjetas de crédito"
                            subTitle="Promociones bancarias"
                            buttonText="Ver promociones"
                            backgroundImage="/promociones-bancarias.svg"
                            popoverContent={
                                currentPromotions.map(prom => {
                                    return <Row style={{ width: '250px' }}>
                                        <Col span={12}><Text type="secondary">{prom.bank}</Text></Col>
                                        <Col span={12}><Text>{`${prom.discount}% de descuento`}</Text></Col>
                                    </Row>;
                                })
                            }
                        />
                    </Col>
                    <Col sm={24} lg={9} >
                        <InfoCard
                            title="Tarjetas de débito"
                            subTitle="Medios de pago"
                            buttonText="Ver más"
                            backgroundImage="/medios-de-pago.svg"
                            popoverContent={
                                <>
                                    <Row style={{ marginBottom: 24 }}>
                                        <Col span={24}><Text type="secondary">Acreditación instantánea.</Text></Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={6}>
                                            <Image preview={false} decoding="async" src="https://http2.mlstatic.com/storage/logos-api-admin/ce454480-445f-11eb-bf78-3b1ee7bf744c-m.svg" class="image-payment-icon" alt="Maestro" />
                                        </Col>
                                        <Col span={6}>
                                            <Image preview={false} decoding="async" src="https://http2.mlstatic.com/storage/logos-api-admin/157dce60-571b-11e8-95d8-631c1a9a92a9-m.svg" class="image-payment-icon" alt="Mastercard Débito" />
                                        </Col>
                                        <Col span={6}>
                                            <Image preview={false} decoding="async" src="https://http2.mlstatic.com/storage/logos-api-admin/cb0af1c0-f3be-11eb-8e0d-6f4af49bf82e-m.svg" class="image-payment-icon" alt="Cabal Débito" />
                                        </Col>
                                        <Col span={6}>
                                            <Image preview={false} decoding="async" src="https://http2.mlstatic.com/storage/logos-api-admin/312238e0-571b-11e8-823a-758d95db88db-m.svg" class="image-payment-icon" alt="Visa Débito" />
                                        </Col>
                                    </Row>
                                </>
                            }
                        />
                    </Col>
                </Row>
                <Row gutter={16} className='space-margin-bottom'>
                    {
                        loadingBestSellers ? <Skeleton active /> :
                            <>
                                <Col sm={24} lg={6} >
                                    <LinksGroup
                                        title="Productos más vendidos"
                                        items={
                                            bestSellers.map((item, i) => {
                                                return { title: item.title, link: `/product-detail/${item._id}` }
                                            })
                                        }
                                    />
                                </Col>
                                {
                                    bestSellers.map(item => (
                                        <Col key={item._id} sm={24} lg={6} >
                                            <ProductSmallCard product={item} />
                                        </Col>
                                    ))
                                }
                            </>
                    }
                </Row>
                <Row gutter={16} className='space-margin-bottom'>
                    {
                        loadingBestSuits ? <Skeleton active /> :
                            <>
                                <Col sm={24} lg={6} >
                                    <LinksGroup
                                        title="Mejores en Trajes"
                                        items={bestSuits.map((item, i) => {
                                            return { title: item.title, link: `/product-detail/${item.id}` }
                                        })}
                                    />
                                </Col>
                                {
                                    bestSuits.map(item => (
                                        <Col key={item._id} sm={24} lg={6} >
                                            <ProductSmallCard key={item._id} product={item} />
                                        </Col>
                                    ))
                                }
                            </>
                    }

                </Row>
            </Content>
        </>
    );
}

export default Home;