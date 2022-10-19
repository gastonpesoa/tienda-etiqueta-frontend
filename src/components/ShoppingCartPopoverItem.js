import '../App.less';
import { Row, Col, Image, Typography, Select, Divider } from 'antd';
const { Title, Text } = Typography;
const { Option } = Select;

const ShoppingCartPopoverItem = ({
    item: { id, nombre, marca, talle, color, precio, puntaje, unidades, imagen },
}) => {
    console.log(nombre, color)
    return (
        <Row>
            <Col span={8}>
                <Image className='shoppingcartpopoveritem-img' src={imagen} alt={nombre} />
            </Col>
            <Col span={16}>
                <Row>
                    <Col><Title level={4}>{nombre}</Title></Col>
                </Row>
                {
                    marca &&
                    <Row>
                        <Col span={12}><Text type="secondary">Marca:</Text></Col>
                        <Col span={12}><Text>{marca}</Text></Col>
                    </Row>
                }
                {
                    talle &&
                    <Row>
                        <Col span={12}><Text type="secondary">Talle:</Text></Col>
                        <Col span={12}><Text>{talle}</Text></Col>
                    </Row>
                }
                {
                    color &&
                    <Row>
                        <Col span={12}><Text type="secondary">Color:</Text></Col>
                        <Col span={12}><Text>{color}</Text></Col>
                    </Row>
                }
                {
                    puntaje &&
                    <Row>
                        <Col span={12}><Text type="secondary">Puntaje:</Text></Col>
                        <Col span={12}><Text>{puntaje}</Text></Col>
                    </Row>
                }
                {
                    precio &&
                    <Row>
                        <Col span={12}>
                            <Title level={5} type="success">
                                {`$${parseFloat(precio).toFixed(2)}`}
                            </Title>
                        </Col>
                        <Col span={12}>
                            <Text type='secondary'>
                                <Select defaultValue="1" style={{ width: 100 }}>
                                    <Option value="1">1 unidad</Option>
                                    <Option value="2">2 unidades</Option>
                                    <Option value="3">3 unidades</Option>
                                    <Option value="4">4 unidades</Option>
                                    <Option value="5">5 unidades</Option>
                                    <Option value="6">6 unidades</Option>
                                </Select>
                            </Text>
                        </Col>
                    </Row>
                }
            </Col>
            <Divider plain></Divider>
        </Row>
    );
}

export default ShoppingCartPopoverItem;