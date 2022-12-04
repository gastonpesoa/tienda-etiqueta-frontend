import { useContext } from 'react';
import { Row, Col, Image, Typography, Divider, Button, Rate } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
import Price from "./Price";
import UnitsSelect from "./UnitsSelect";
import '../App.less';
const { Title, Text } = Typography;

const ShoppingCartPopoverItem = ({ item }) => {

    const { dispatchShoppingCartEvent } = useContext(AppContext);

    const handleRemoveItem = () => {
        dispatchShoppingCartEvent('REMOVE_ITEM', { itemSku: item.sku });
    }

    const handleUpdateItem = (quantity) => {
        dispatchShoppingCartEvent(
            'UPDATE_ITEM',
            {
                itemToUpdate: item,
                itemUpdated: { ...item, unit: quantity }
            });
    }

    return (
        <Row>
            <Col span={8}>
                <Image className='shoppingcartpopoveritem-img' src={item.image} alt={item.title} preview={false} />
                <Button
                    icon={<CloseOutlined />}
                    style={{ marginTop: '25px', float: 'left' }}
                    onClick={handleRemoveItem}
                >
                    Remover
                </Button>
            </Col>
            <Col span={16}>
                <Row>
                    <Col><Title level={4}>{item.title}</Title></Col>
                </Row>
                {
                    item.brand &&
                    <Row>
                        <Col span={12}><Text type="secondary">Marca:</Text></Col>
                        <Col span={12}><Text>{item.brand}</Text></Col>
                    </Row>
                }
                {
                    item.size &&
                    <Row>
                        <Col span={12}><Text type="secondary">Talle:</Text></Col>
                        <Col span={12}><Text>{item.size}</Text></Col>
                    </Row>
                }
                {
                    item.color &&
                    <Row>
                        <Col span={12}><Text type="secondary">Color:</Text></Col>
                        <Col span={12}><Text>{item.color}</Text></Col>
                    </Row>
                }
                {
                    item.rating_average > 0 &&
                    <Row>
                        <Col span={24}>
                            <Rate
                                defaultValue={item.rating_average}
                                disabled
                                allowHalf
                                style={{ color: "black" }}
                            />
                        </Col>
                    </Row>
                }
                <Row>
                    <Col span={12}>
                        <Price price={item.price} level={5} type={"success"} />
                    </Col>
                    <Col span={12}>
                        <UnitsSelect units={item.units} unit={item.unit} setUnit={handleUpdateItem} size={'medium'} />
                    </Col>
                </Row>
            </Col>
            <Divider plain></Divider>
        </Row>
    );
}

export default ShoppingCartPopoverItem;