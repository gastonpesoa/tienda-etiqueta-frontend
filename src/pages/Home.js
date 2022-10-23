import { Carousel, Image, Row, Col, Layout } from 'antd';
import LinksGroup from "../components/LinksGroup";
import InfoCard from "../components/InfoCard";
import ProductSmallCard from "../components/ProductSmallCard";
const { Content } = Layout;

const Home = ({ carouselSource, bestSellers, bestSuits }) => {
    return (
        <>
            <div className='carousel-container-style'>
                <Carousel autoplay>
                    {
                        carouselSource.map(img => (
                            <Image src={img.src} alt={img.alt} className='carousel-img' preview={false} />
                        ))
                    }
                </Carousel>
            </div>
            <Content style={{ padding: '0 50px' }} >
                <Row gutter={16} className='space-margin-bottom'>
                    <Col sm={24} lg={6} >
                        <LinksGroup
                            title="Menú de Categorías"
                            items={[
                                { title: "Ambos" },
                                { title: "Trajes" },
                                { title: "Camisas" },
                                { title: "Corbatas" },
                                { title: "Zapatos" },
                            ]}
                            buttonText="Más categorias"
                        />
                    </Col>
                    <Col sm={24} lg={9} >
                        <InfoCard
                            title="Tarjetas de crédito"
                            subTitle="Promociones bancarias"
                            buttonText="Ver promociones"
                            backgroundImage="/promociones-bancarias.svg"
                        />
                    </Col>
                    <Col sm={24} lg={9} >
                        <InfoCard
                            title="Tarjetas de débito"
                            subTitle="Medios de pago"
                            buttonText="Ver más"
                            backgroundImage="/medios-de-pago.svg"
                        />
                    </Col>
                </Row>
                <Row gutter={16} className='space-margin-bottom'>
                    <Col sm={24} lg={6} >
                        <LinksGroup
                            title="Productos más vendidos"
                            items={[
                                { title: "Ambos Azul Entallado" },
                                { title: "Camisa Blanca Lila a Raya" },
                                { title: "Moño Lunares Rojos" },
                                { title: "Traje Dorado Militar" },
                                { title: "Zapatos Ellington" },
                            ]}
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
                            items={[
                                { title: "Trajes Dorados" },
                                { title: "Trajes Negros" },
                                { title: "Trajes Azules" },
                                { title: "Trajes Bordos" },
                                { title: "Trajes Blancos" },
                            ]}
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