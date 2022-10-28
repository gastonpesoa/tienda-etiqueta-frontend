import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Typography } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import myData from '../data.json';
const { Title, Text } = Typography;

const ProductDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { trajes } = myData;
    const traje = trajes[0];

    return (
        <>
            <Title>Detalle {id}</Title>
        </>
    )
}

export default ProductDetail