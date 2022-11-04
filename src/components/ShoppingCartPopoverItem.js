import { useEffect, useState, useContext } from 'react';
import { Row, Col, Image, Typography, Select, Divider, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ShoppingCartContext } from "../ShoppingCartContext";
import Price from "./Price";
import Rating from "./Rating";
import UnitsSelect from "./UnitsSelect";
import '../App.less';
const { Title, Text } = Typography;
const { Option } = Select;

const ShoppingCartPopoverItem = ({ item }) => {

    const { dispatchShoppingCartEvent } = useContext(ShoppingCartContext);

    const handleRemoveItem = () => {
        dispatchShoppingCartEvent('REMOVE_ITEM', { itemId: item.id });
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
                    style={{ marginTop: '25px' }}
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
                    item.rating_average &&
                    <Row>
                        <Col span={24}><Rating rating={item.rating_average} /></Col>
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