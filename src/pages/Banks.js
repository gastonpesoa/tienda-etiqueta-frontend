import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Typography, Table } from 'antd';
import { useEffect, useState } from 'react';
const { Title, Text } = Typography;

const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
];
  
const columns = [
    {
      title: 'Banco',
      dataIndex: 'bank',
      key: 'bank',
    },
    {
      title: 'Descuento',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount) => {
        if (discount <= 0)
            return '-';
        return discount + '%';
      }
    },
    {
      title: 'Promoción vigente',
      dataIndex: 'discount_status',
      key: 'discount_status',
      render: (discount_status) => {
        return discount_status ? "Sí" : "No"
      }
    },
];

const Banks = () => {

    const navigate = useNavigate()

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL_BASE}/banks/`)
            .then((res) => res.ok ? res.json() : Promise.reject(res))
            .then(({data}) => {
                setDataSource(data);
                /*if (data.length > 0) {
                    data.forEach((bk) => {
                        let bankAux = {};
                        bankAux.value = bk.bank;
                        bankAux.label = bk.bank;
                        bankAux.discount = bk.discount_status ? bk.discount : 0;
                        if (bk.discount !== null && bk.discount > 0 && bk.discount_status) {
                            bankAux.label += ' (-' + bk.discount + '%)' ;
                        }
                        bankList.push(bankAux);
                    });
                } else {
                    message.error("No hay bancos disponibles");
                }*/
            })
            .catch((err) => {
                console.error(err);
                //message.error("Hubo un error al traer el listado de bancos disponibles, intente nuevamente más tarde");
            });
    }, []);

    const handleClseSesion = () => {
        navigate('/')
    }

    return (
        <>
            <Title level={2}>Bancos</Title>
            <Table
                dataSource={dataSource}
                columns={columns}
            />
        </>
        
    )
}

export default Banks