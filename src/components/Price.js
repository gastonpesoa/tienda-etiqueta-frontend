import { Typography } from 'antd';
const { Title, Text } = Typography;

const Price = ({ price, type, level, style, isText }) => {
    const formatPrice = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2,
        roundingIncrement: 5,
    }
    ).format(price)
    return (
        <>
            {
                isText
                    ? <Text style={style}>{formatPrice}</Text>
                    : <Title level={level} type={type} style={style}>{formatPrice}</Title>
            }
        </>
    );
}

export default Price;