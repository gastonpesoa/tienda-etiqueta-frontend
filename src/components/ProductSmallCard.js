import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Image } from 'antd';
import Price from "./Price";
const { Meta } = Card;

const ProductSmallCard = ({ product }) => {

    return (
        <Link to={`../product-detail/${product.id}`}>
            <Card hoverable style={{ width: 330 }}>
                <Image
                    alt={product.title}
                    src={product.image}
                    preview={false}
                    style={{ marginBottom: '20px' }} />
                <Meta
                    title={product.title}
                    description={product.description}
                    style={{ height: '80px' }}
                />
                <Price price={product.price} level={4} style={{ marginTop: '10px' }} />
            </Card>
        </Link>
    );
}

export default ProductSmallCard;