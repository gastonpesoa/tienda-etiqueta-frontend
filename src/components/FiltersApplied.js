import { Space, Radio, Typography, Tag } from 'antd';
import '../App.less';
const { Title, Text } = Typography;

const FiltersApplied = ({ filters, dispatchRemoveFilterApplied }) => {
    const onCloseFilterTag = (value) => {
        dispatchRemoveFilterApplied(value)
    };
    return (
        <>
            {
                filters.length > 0 &&
                <Space>
                    <Text style={{ color: '#A9A9A9', fontWeight: '600' }}>Filtros aplicados</Text>
                    {
                        filters.map((filter, i) => (
                            <Tag key={i} closable className='filter-tag' onClose={() => onCloseFilterTag(filter)}>{filter.value}</Tag>
                        ))
                    }
                </Space>
            }
        </>
    );
}

export default FiltersApplied;