import { useState } from 'react';
import { Space, Typography, Col, InputNumber, Row, Slider } from 'antd';
const { Title, Text } = Typography;

const FilterPrice = ({ min, max, dispatchFilterPriceApplied }) => {
    const [inputMinValue, setMinInputValue] = useState(2000);
    const [inputMaxValue, setMaxInputValue] = useState(50000);
    const onChange = (value) => {
        if (isNaN(value[0]) || isNaN(value[1])) {
            return;
        }
        setMinInputValue(value[0]);
        setMaxInputValue(value[1])
        dispatchFilterPriceApplied({ type: "price", minValue: value[0], maxValue: value[1] })
    };
    const onChangeMin = (value) => {
        if (isNaN(value)) {
            return;
        }
        setMinInputValue(value);
        dispatchFilterPriceApplied({ type: "price", minValue: value, maxValue: inputMaxValue })
    };
    const onChangeMax = (value) => {
        if (isNaN(value)) {
            return;
        }
        setMaxInputValue(value);
        dispatchFilterPriceApplied({ type: "price", minValue: inputMinValue, maxValue: value })
    };
    return (
        <Space direction='vertical'>
            <Title level={4}>Precio</Title>
            <Slider
                range
                min={0}
                max={100000}
                defaultValue={[inputMinValue, inputMaxValue]}
                value={[inputMinValue, inputMaxValue]}
                style={{ width: '19em' }}
                onChange={onChange}
                step={100.00}
            />
            <Row>
                <Col span={12}>
                    <Text strong={true}>Min</Text>
                </Col>
                <Col span={12}>
                    <Text strong={true}>Max</Text>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <InputNumber
                        min={0}
                        max={90000}
                        step={100}
                        value={inputMinValue}
                        onChange={onChangeMin}
                    />
                </Col>
                <Col span={12}>
                    <InputNumber
                        min={0}
                        max={1000000}
                        step={100}
                        value={inputMaxValue}
                        onChange={onChangeMax}
                    />
                </Col>
            </Row>
        </Space>
    );
}

export default FilterPrice;