import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router'
import { Link } from "react-router-dom";
import { Result, Button, Skeleton } from 'antd';
import { AppContext } from "../AppContext";

const CheckoutResult = () => {

    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOrderById = async (url) => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                })
                const data = await res.json();
                setOrder(data.data);
                setLoading(false);
            } catch (error) {
                alert(error)
            }
        }
        getOrderById(`${process.env.REACT_APP_API_URL_BASE}/orders/id/${orderId}`)
    }, [])

    return (
        <>
            {
                loading
                    ? (<Skeleton active />)
                    : <Result
                        status="success"
                        title="Compra realizada con éxito!"
                        subTitle={`Order number: ${order.id}.`}
                        extra={[
                            <Link to="/user-profile" key="compras">
                                <Button type="primary" >
                                    Ver en mis compras
                                </Button>
                            </Link>,
                            <Link to="/" key="buy">
                                <Button>Volver a la página de inicio</Button>
                            </Link>
                        ]}
                    />
            }
        </>
    )
}

export default CheckoutResult