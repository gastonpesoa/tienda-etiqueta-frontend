import { Space, Checkbox, Typography } from 'antd';
import '../App.less';
const { Title, Text } = Typography;

const FilterBrand = ({ brands }) => {
    const onChangeBrand = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };
    return (
        <Space direction='vertical'>
            <Title level={4}>Marcas</Title>
            <Checkbox.Group options={brands} onChange={onChangeBrand} />
        </Space>
    );
}

export default FilterBrand;