import { Row, Col, Image, Typography, Select, Divider } from 'antd';
import Price from "./Price";
import Rating from "./Rating";
import UnitsSelect from "./UnitsSelect";
import '../App.less';
const { Title, Text } = Typography;
const { Option } = Select;

const ShoppingCartPopoverItem = ({
    item: { id, name, brand, size, color, price, rating_average, units, image },
}) => {
    return (
        <Row>
            <Col span={8}>
                <Image className='shoppingcartpopoveritem-img' src={image} alt={name} preview={false} />
            </Col>
            <Col span={16}>
                <Row>
                    <Col><Title level={4}>{name}</Title></Col>
                </Row>
                {
                    brand &&
                    <Row>
                        <Col span={12}><Text type="secondary">Marca:</Text></Col>
                        <Col span={12}><Text>{brand}</Text></Col>
                    </Row>
                }
                {
                    size &&
                    <Row>
                        <Col span={12}><Text type="secondary">Talle:</Text></Col>
                        <Col span={12}><Text>{size}</Text></Col>
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
                    rating_average &&
                    <Row>
                        <Col span={24}><Rating rating={rating_average} /></Col>
                    </Row>
                }                
                <Row>                        
                    <Col span={12}>
                        <Price price={price} level={5} type={"success"} />
                    </Col>
                    <Col span={12}>
                        <Select defaultValue="1" style={{ width: 100 }}>
                            <Option value="1">1 unidad</Option>
                            <Option value="2">2 unidades</Option>
                            <Option value="3">3 unidades</Option>
                            <Option value="4">4 unidades</Option>
                            <Option value="5">5 unidades</Option>
                            <Option value="6">6 unidades</Option>
                        </Select>
                    </Col>
                </Row>                
            </Col>
            <Divider plain></Divider>
        </Row>
    );
}

export default ShoppingCartPopoverItem;