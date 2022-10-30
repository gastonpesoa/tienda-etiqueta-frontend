import { useState, useEffect, useRef } from 'react';
import { Divider, Input, Select, Space, Button, InputNumber, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Title, Text } = Typography;

const UnitsSelect = ({ units, setUnit, size }) => {

    const [items, setItems] = useState([1]);
    const [newUnit, setNewUnit] = useState();
    const selectRef = useRef(null);

    useEffect(() => {
        var updatedItems = []
        updatedItems.push(1)
        for (let index = 1; index < 6; index++) {
            updatedItems.push(index + 1)
        }
        setItems(updatedItems);
    }, [])

    const onNewUnitChange = (newUnit) => {
        setNewUnit(newUnit);
    };

    const addItem = (e) => {
        e.preventDefault();
        if (isNaN(newUnit) || items.includes(newUnit)) {
            return;
        }
        setItems([...items, newUnit]);
        setNewUnit();
    };

    const handleSelectionChange = (value) => {
        setUnit(value)
    };

    return (
        <>
            {
                units > 6
                    ?
                    (
                        <Select
                            ref={selectRef}
                            defaultValue={'1 unidad'}
                            style={{ width: 135 }}
                            size={size}
                            onChange={handleSelectionChange}
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider
                                        style={{
                                            margin: '8px 0',
                                        }}
                                    />
                                    <Text style={{
                                        padding: '0 8px 4px',
                                    }}>Más de 6 unidades</Text>
                                    <Space
                                        style={{
                                            padding: '0 8px 4px',
                                        }}
                                    >
                                        <InputNumber
                                            min={7}
                                            max={units}
                                            value={newUnit}
                                            onChange={onNewUnitChange}
                                            style={{ width: 80 }}
                                        />
                                        <Button icon={<RightOutlined />} onClick={addItem} />
                                    </Space>
                                </>
                            )}
                        >
                            {items.map((item) => (
                                <Option key={item}>{item == 1 ? '1 unidad' : `${item} unidades`}</Option>
                            ))}
                        </Select>
                    )
                    :
                    (
                        <Select
                            ref={selectRef}
                            defaultValue={'1 unidad'}
                            style={{ width: 135 }}
                            size={size}
                            onChange={handleSelectionChange}>
                            {items.map((item) => (
                                <Option key={item}>{item == 1 ? '1 unidad' : `${item} unidades`}</Option>
                            ))}
                        </Select>
                    )
            }
        </>


    );
}

export default UnitsSelect;