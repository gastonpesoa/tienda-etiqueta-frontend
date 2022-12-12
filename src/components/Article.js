import { Col, Row, Form, Input, InputNumber } from 'antd';

const Article = ({ articleNumber }) => {
    return (
        <Row gutter={8}>
            <Col span={12}>
                <Form.Item
                    label="Talle"
                    name={`size${articleNumber}`}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingresá el talle del artículo!',
                        },
                    ]}
                >
                    <Input placeholder="Ingrese el talle del artículo" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="Stock"
                    name={`stock${articleNumber}`}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingresá el stock del talle!',
                        },
                    ]}
                >
                    <InputNumber 
                        placeholder="Ingrese el stock del talle" 
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        style={{ width: '100%' }}
                        addonAfter="unidades"
                    />
                </Form.Item>
            </Col>
        </Row>
    );
}

export default Article;