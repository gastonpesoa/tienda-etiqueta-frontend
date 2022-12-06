import { Link } from 'react-router-dom';
import { Card, Image } from 'antd';
import Price from "./Price";
const { Meta } = Card;

const ProductSmallCard = ({ product }) => {

    return (
        <Link to={`../product-detail/${product._id}`}>
            <Card hoverable style={{ width: 330 }}>
                <Image
                    alt={product.title}
                    src={product.images[0]}
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