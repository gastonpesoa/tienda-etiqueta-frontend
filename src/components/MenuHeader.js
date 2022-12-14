import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd';

function MenuHeader({ menu }) {
    const navigate = useNavigate()
    return (
        <Menu theme="light" mode="horizontal" style={{ background: '#F9F9F9' }}>
            {
                menu.map(item => (
                    item.items.length
                        ?
                        (
                            <Menu.SubMenu
                                key={item.key}
                                title={item.title}
                                onTitleClick={() => { navigate(item.link) }}>
                                {
                                    item.items.map(subItem => (
                                        <Menu.Item key={subItem.key} onClick={() => { navigate(subItem.link) }}>
                                            {subItem.title}
                                        </Menu.Item>
                                    ))
                                }
                            </Menu.SubMenu>
                        )
                        :
                        (
                            <Menu.Item key={item.key} onClick={() => { navigate(item.link) }}>
                                {item.title}
                            </Menu.Item>
                        )
                ))
            }
        </Menu>
    );
}

export default MenuHeader;
