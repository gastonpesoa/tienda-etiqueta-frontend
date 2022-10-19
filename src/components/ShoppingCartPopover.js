import { Badge, Popover, Col, Row, Space, Button, Typography, List } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import ShoppingCartPopoverItem from "./ShoppingCartPopoverItem";
const { Title, Text } = Typography;

const ShoppingCartPopover = ({ items }) => {

    const subtotal = items.reduce((accumulator, item) => {
        return accumulator + item.precio;
    }, 0);

    const popoverContent = (
        <>
            <Row>
                <Col span={24}><Title level={3}>Carrito de compras</Title></Col>
            </Row>
            <Space direction='vertical'>

                {items.length
                    ? (items.map(item => (
                        <ShoppingCartPopoverItem
                            key={item.id}
                            item={item}
                        />)))
                    : <Row><Col span={24}><Title level={4}>Tu carrito está vacío</Title></Col></Row>}
            </Space>
            {
                items.length > 0 &&
                <>
                    <Row>
                        <Col span={12}><Title level={5}>Subtotal</Title></Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Title level={4}>
                                {`$${parseFloat(subtotal).toFixed(2)}`}
                            </Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Space align='center'>
                                <Button type="primary" size='large'>Ir a pagar</Button>
                            </Space>
                        </Col>
                    </Row>
                </>
            }
        </>
    );

    return (
        <Popover content={popoverContent} placement='bottomRight'>
            <Badge count={5}>
                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
            </Badge>
        </Popover>
    );
}

export default ShoppingCartPopover;