import { Space, Checkbox, Typography } from 'antd';
import '../App.less';
const { Title, Text } = Typography;

const FilterRating = ({ ratings, dispatchFilterRatingApplied }) => {
    const onChange = (checkedValues) => {
        dispatchFilterRatingApplied({ type: "rate", value: checkedValues })
    };
    return (
        <Space key={ratings.id} direction='vertical'>
            <Title level={4}>Valoraciones</Title>
            <Checkbox.Group options={ratings} onChange={onChange} />
        </Space>
    );
}

export default FilterRating;