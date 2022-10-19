import { Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from 'antd';

function MenuHeader({ menu }) {

    return (
        <Menu theme="light" mode="horizontal" style={{ background: '#F9F9F9' }}>
            {
                menu.map(item => (
                    item.items.length
                        ? (
                            <Menu.SubMenu key={item.key} title={item.title}>
                                {
                                    item.items.map(subItem => (
                                        <Menu.Item key={subItem.key}>
                                            {subItem.title}
                                        </Menu.Item>
                                    ))
                                }
                            </Menu.SubMenu>
                        )
                        : (
                            <Menu.Item key={item.key}>
                                {item.title}
                            </Menu.Item>
                        )
                ))
            }
        </Menu>
    );
}

export default MenuHeader;
