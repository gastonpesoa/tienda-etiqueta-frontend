import { Table } from 'antd';

const DataTable = ({ dataSource, columns }) => {
    return (
        <>
            <Table
                dataSource={dataSource}
                columns={columns}
            >

            </Table>
        </>
    );
}

export default DataTable;