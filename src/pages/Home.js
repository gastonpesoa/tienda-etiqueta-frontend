import {
    Carousel, Image, Row, Col,
    Typography, Layout, Space, Button, Card
} from 'antd';
import LinksGroup from "../components/LinksGroup";
import InfoCard from "../components/InfoCard";
const { Content } = Layout;
const { Title, Text } = Typography;

const Home = ({ carouselSource }) => {
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
                    <Col sm={24} lg={8} >
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
                    <Col sm={24} lg={8} >
                        <InfoCard
                            title="Tarjetas de crédito"
                            subTitle="Promociones bancarias"
                            buttonText="Ver promociones"
                        />
                    </Col>
                    <Col sm={24} lg={8} >
                        <InfoCard
                            title="Tarjetas de débito"
                            subTitle="Medios de pago"
                            buttonText="Ver más"
                        />
                    </Col>
                </Row>
                <Row gutter={16} className='space-margin-bottom'>
                    <Col sm={24} lg={8} >
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
                    <Col sm={24} lg={8} >
                        <Card>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                    <Col sm={24} lg={8} >
                        <Card>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16} className='space-margin-bottom'>
                    <Col sm={24} lg={8} >
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
                    <Col sm={24} lg={8} >
                        <Card>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                    <Col sm={24} lg={8} >
                        <Card>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </>
    );
}

export default Home;