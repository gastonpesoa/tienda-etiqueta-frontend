import { Space, Radio, Typography, Tag } from 'antd';
import '../App.less';
const { Title, Text } = Typography;

const FiltersApplied = ({ filters }) => {
    const onCloseFilterTag = (value) => {
        console.log('radio checked', value);
    };
    return (
        <Space>
            <Text style={{ color: '#A9A9A9', fontWeight: '600' }}>Filtros aplicados</Text>
            <Tag closable className='filter-tag' onClose={onCloseFilterTag}>Hombre</Tag>
            <Tag closable className='filter-tag' onClose={onCloseFilterTag}>XL</Tag>
        </Space>
    );
}

export default FiltersApplied;