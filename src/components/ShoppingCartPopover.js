import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { Badge, Popover, Col, Row, Space, Button, Typography, Empty, Alert, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { AppContext } from "../AppContext";
import ShoppingCartPopoverItem from "./ShoppingCartPopoverItem";
import Price from "./Price";
const { Title } = Typography;

const ShoppingCartPopover = () => {

    const { shoppingCart, subtotal } = useContext(AppContext);
    const navigate = useNavigate()

    const handleCheckoutClick = () => {
        let token = localStorage.getItem("token")
        if (!token) {
            message.info("Inicia sesión para continuar")
        } else {
            navigate('/checkout')
        }
    }

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
                                <Button type="primary" size='large' onClick={handleCheckoutClick}>
                                    Ir a pagar
                                </Button>
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
                <ShoppingCartOutlined style={{ fontSize: '24px', marginTop: '2px' }} />
            </Badge>
        </Popover>
    );
}

export default ShoppingCartPopover;