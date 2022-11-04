import { Space, Checkbox, Typography } from 'antd';
import '../App.less';
const { Title, Text } = Typography;

const FilterRating = ({ ratings }) => {
    const onChangeRating = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };
    return (
        <Space key={ratings.id} direction='vertical'>
            <Title level={4}>Valoraciones</Title>
            <Checkbox.Group options={ratings} onChange={onChangeRating} />
        </Space>
    );
}

export default FilterRating;