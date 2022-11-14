import { Carousel, Image, Row, Col, Layout, Typography } from 'antd';
import LinksGroup from "../components/LinksGroup";
import InfoCard from "../components/InfoCard";
import ProductSmallCard from "../components/ProductSmallCard";
import '../App.less';
import { useEffect, useState } from 'react';
const { Content } = Layout;
const { Text } = Typography;

const Home = ({ carouselSource, bestSellers, bestSuits, menu }) => {

    const [currentPromotions, setCurrentPromotions] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/banks/valid/`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({data}) => {
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
    }, []);

    return (
        <>
            <div className='carousel-container-style'>
                <Carousel autoplay>
                    {
                        carouselSource.map((img, i)=> (
                            <Image key={i} src={img.src} alt={img.alt} className='carousel-img' preview={false} />
                        ))
                    }
                </Carousel>
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
                    <Col sm={24} lg={6} >
                        <LinksGroup
                            title="Productos más vendidos"
                            items={bestSellers.map((item, i) => {
                                return { title: item.title, link: `/product-detail/${item.id}` }
                            })}
                        />
                    </Col>
                    {
                        bestSellers.map(item => (
                            <Col key={item.id} sm={24} lg={6} >
                                <ProductSmallCard key={item.id} product={item} />
                            </Col>
                        ))
                    }
                </Row>
                <Row gutter={16} className='space-margin-bottom'>
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
                            <Col key={item.id} sm={24} lg={6} >
                                <ProductSmallCard key={item.id} product={item} />
                            </Col>
                        ))
                    }
                </Row>
            </Content>
        </>
    );
}

export default Home;