import { Link } from "react-router-dom";
import { Typography, Result, Button } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const Error404 = () => {
    return (
        <>
            <Result
                status="404"
                title="404"
                subTitle="Lo sentimos, la página que ha visitado no existe."
                extra={
                    <Link to="/">
                        <Button type="primary">Volver a la página de inicio</Button>
                    </Link>
                }
            />
        </>
    )
}

export default Error404