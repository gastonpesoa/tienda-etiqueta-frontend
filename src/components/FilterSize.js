import { Typography, Select } from 'antd';
import '../App.less';
const { Option } = Select;
const { Title, Text } = Typography;

const FilterSize = ({ sizes }) => {
    const onChangeSize = (value) => {
        console.log('radio checked', value);
    };
    return (
        <div className='header-filter-container'>
            <Text>Talle:</Text>
            <Select
                style={{ marginLeft: 10, width: 70 }}
                onChange={onChangeSize}
            >
                <Option value="XS">XS</Option>
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
                <Option value="XL">XL</Option>
                <Option value="XXL">XXL</Option>
            </Select>
        </div>
    );
}

export default FilterSize;