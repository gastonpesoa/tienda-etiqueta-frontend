import { Space, Checkbox, Typography } from 'antd';
import '../App.less';
const { Title, Text } = Typography;

const FilterBrand = ({ brands, dispatchFilterBrandApplied }) => {
    const onChangeBrand = (checkedValues) => {
        dispatchFilterBrandApplied({ type: "brand", value: checkedValues })
    };
    return (
        <Space key={brands.id} direction='vertical'>
            <Title level={4}>Marcas</Title>
            <Checkbox.Group options={brands} onChange={onChangeBrand} />
        </Space>
    );
}

export default FilterBrand;