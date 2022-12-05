import { Radio } from 'antd';
import '../App.less';

const FilterGender = ({ dispatchFilterGenderApplied }) => {
    const onChangeGender = (e) => {
        dispatchFilterGenderApplied({ type: "gender", value: e.target.value })
    };
    return (
        <div className='header-filter-container'>
            <Radio.Group onChange={onChangeGender} style={{ marginTop: 4 }}>
                <Radio value={'Mujer'}>Mujer</Radio>
                <Radio value={'Hombre'}>Hombre</Radio>
            </Radio.Group>
        </div>
    );
}

export default FilterGender;