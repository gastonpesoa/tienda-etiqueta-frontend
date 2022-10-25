import { Space } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import '../App.less';

const Rating = ({ rating, color }) => {
    return (
        <>
            {
                rating == 1 &&
                <Space>
                    <StarFilled style={{ color: color }} />
                    <StarOutlined className='star-outlined' />
                    <StarOutlined className='star-outlined' />
                    <StarOutlined className='star-outlined' />
                    <StarOutlined className='star-outlined' />
                </Space>
            }
            {
                rating == 2 &&
                <Space>
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                    <StarOutlined className='star-outlined' />
                    <StarOutlined className='star-outlined' />
                    <StarOutlined className='star-outlined' />
                </Space>
            }
            {
                rating == 3 &&
                <Space>
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                    <StarOutlined className='star-outlined' />
                    <StarOutlined className='star-outlined' />
                </Space>
            }
            {
                rating == 4 &&
                <Space>
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                    <StarOutlined className='star-outlined' />
                </Space>
            }
            {
                rating == 5 &&
                <Space>
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                    <StarFilled style={{ color: color }} />
                </Space>
            }
        </>
    );
}

export default Rating;