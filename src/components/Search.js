import { AutoComplete, Input } from 'antd';

const Search = () => {
    return (
        <div>
            <AutoComplete
                dropdownMatchSelectWidth={252}
                style={{
                    width: 600,
                }}
            >
                <Input.Search size="large" placeholder="Buscar Productos, categorías ..." enterButton />
            </AutoComplete>
        </div>
    );
}

export default Search;