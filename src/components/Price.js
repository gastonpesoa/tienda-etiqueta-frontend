import { Typography } from 'antd';
const { Title, Text } = Typography;

const Price = ({ price, type, level, style, isText }) => {
    return (
        <>
            {
                isText
                    ? <Text style={style}>
                        {`$${parseFloat(price).toFixed(2)}`}
                    </Text>
                    : <Title level={level} type={type} style={style}>
                        {
                            new Intl.NumberFormat("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                maximumFractionDigits: 2,
                                roundingIncrement: 5,
                            }
                            ).format(price)
                        }
                    </Title>
            }
        </>
    );
}

export default Price;