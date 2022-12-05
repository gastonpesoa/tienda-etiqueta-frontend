import { Typography, Select } from 'antd';
import '../App.less';
const { Option } = Select;
const { Text } = Typography;

const FilterSize = ({ sizes, dispatchFilterSizeApplied }) => {
    const onChangeSize = (value) => {
        dispatchFilterSizeApplied({ type: "size", value: value })
    };
    return (
        <div className='header-filter-container'>
            <Text>Talle:</Text>
            <Select
                style={{ marginLeft: 10, width: 70 }}
                onChange={onChangeSize}
            >
                {
                    sizes.map((item, i) => (

                        <Option key={i} value={item}>{item}</Option>
                    ))
                }
            </Select>
        </div>
    );
}
export default FilterSize;