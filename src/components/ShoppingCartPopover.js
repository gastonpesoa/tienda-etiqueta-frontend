import { useContext } from 'react';
import { Link } from "react-router-dom";
import { Badge, Popover, Col, Row, Space, Button, Typography, Empty } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
import ShoppingCartPopoverItem from "./ShoppingCartPopoverItem";
import Price from "./Price";
const { Title } = Typography;

const ShoppingCartPopover = () => {

    const { shoppingCart, subtotal } = useContext(AppContext);    

    const popoverContent = (
        <>
            <Row>
                <Col span={24}><Title level={3}>Carrito de compras</Title></Col>
            </Row>
            <Space direction='vertical'>
                {
                    shoppingCart.length
                        ?
                        (shoppingCart.map((item) => (
                            <ShoppingCartPopoverItem
                                key={item.id}
                                item={item}
                            />
                        )))
                        :
                        <Empty
                            description={
                                <Title level={5}>
                                    Tu carrito está vacío
                                </Title>
                            }
                        />
                }
            </Space>
            {
                shoppingCart.length > 0 &&
                <>
                    <Row>
                        <Col span={12}><Title level={5}>Subtotal</Title></Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Price price={subtotal} level={4} type={"default"} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Space align='center'>
                                <Link to={"/checkout"}>
                                    <Button type="primary" size='large'>Ir a pagar</Button>
                                </Link>
                            </Space>
                        </Col>
                    </Row>
                </>
            }
        </>
    );

    return (
        <Popover content={popoverContent} placement='bottomRight'>
            <Badge count={shoppingCart.length}>
                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
            </Badge>
        </Popover>
    );
}

export default ShoppingCartPopover;