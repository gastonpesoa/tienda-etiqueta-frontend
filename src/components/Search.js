import { useNavigate } from 'react-router-dom'
import { AutoComplete, Input } from 'antd';

const Search = () => {
    const navigate = useNavigate()
    const onSearch = (value) => {
        navigate(`/products-search/${value}`)
    }
    return (
        <div>
            <AutoComplete
                dropdownMatchSelectWidth={252}
                style={{
                    width: 600,
                }}
            >
                <Input.Search
                    size="large"
                    placeholder="Buscar productos, categorías ..."
                    enterButton
                    onSearch={onSearch}
                />
            </AutoComplete>
        </div>
    );
}

export default Search;