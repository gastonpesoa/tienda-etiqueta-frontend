import { Radio } from 'antd';
import '../App.less';

const FilterGender = () => {
    const onChangeGender = (e) => {
        console.log('radio checked', e.target.value);
    };
    return (
        <div className='header-filter-container'>
            <Radio.Group onChange={onChangeGender} style={{ marginTop: 4 }}>
                <Radio value={1}>Mujer</Radio>
                <Radio value={2}>Hombre</Radio>
            </Radio.Group>
        </div>
    );
}

export default FilterGender;