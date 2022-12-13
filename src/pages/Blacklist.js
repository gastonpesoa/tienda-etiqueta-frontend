import { useState, useEffect } from 'react'
import { Skeleton, Row, Col, Table, Typography, message } from 'antd';
const { Title } = Typography;

const Blacklist = () => {

    const [blacklist, setBlacklist] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getBlacklist()
    }, [])

    const getBlacklist = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL_BASE}/users/blacklist`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
            const data = await res.json();
            let newArray = []
            data.data.map(item => {
                newArray.push({
                    key: item._id,
                    name: item.name,
                    last_name: item.last_name,
                    email: item.email,
                    type: item.type,
                    warnings: item.warnings
                })
            })
            setBlacklist(newArray);
            setLoading(false);
        } catch (error) {
            message.error(error)
            console.log(error)
        }
    }

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Apellido',
            dataIndex: 'last_name',
            key: 'last_name'
        },
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Amonestaciones',
            dataIndex: 'warnings',
            key: 'warnings'
        }
    ];

    return (
        <>
            {
                loading
                    ? <Skeleton active />
                    : <>
                        <Row>
                            <Col span={12}>
                                <Title level={2}>Blacklist</Title>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table dataSource={blacklist} columns={columns} pagination={{ pageSize: 5 }}></Table>
                            </Col>
                        </Row>
                    </>
            }
        </>
    );
}

export default Blacklist;