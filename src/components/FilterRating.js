import { Space, Checkbox, Typography } from 'antd';
import '../App.less';
const { Title, Text } = Typography;

const FilterRating = ({ ratings, handleFilterRatingChange }) => {
        
    return (
        <Space key={ratings.id} direction='vertical'>
            <Title level={4}>Valoraciones</Title>
            <Checkbox.Group options={ratings} onChange={handleFilterRatingChange} />
        </Space>
    );
}

export default FilterRating;