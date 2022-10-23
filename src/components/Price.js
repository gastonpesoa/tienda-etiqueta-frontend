import { Typography } from 'antd';
const { Title } = Typography;

const Price = ({ price, type, level, style }) => {
    return (
        <>
            {
                <Title level={level} type={type} style={style}>
                    {`$${parseFloat(price).toFixed(2)}`}
                </Title>
            }
        </>
    );
}

export default Price;