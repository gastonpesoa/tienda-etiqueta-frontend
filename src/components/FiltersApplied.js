import { Space, Typography, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
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
                            filter.type !== "brand" && filter.type !== "rate" &&
                            <Button
                                key={i}
                                onClick={() => onCloseFilterTag(filter)}
                                icon={<CloseOutlined />}
                            >
                                {
                                    filter.type === "price"
                                        ? `$${filter.minValue} - $${filter.maxValue}`
                                        : filter.value
                                }
                            </Button>
                        ))
                    }
                </Space>
            }
        </>
    );
}

export default FiltersApplied;