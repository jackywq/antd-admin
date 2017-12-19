import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { arrayToTree, queryArray } from 'utils';
import pathToRegexp from 'path-to-regexp';

const Menus = ({ siderFold, darkTheme, navOpenKeys, changeOpenKeys, menu, location }) => {
    // 生成树状
    // const menuTree = arrayToTree(menu.filter(_ => _.mpid !== '-1'), 'id', 'mpid');
    const menuTree = [
        {
            icon: "laptop",
            id: 1,
            name: "Dashboard",
            route: "/dashboard"
        },
        {
            name: "供应商管理",
            router: "/suppier",
            id: 2,
            children: [
                {
                    id: 10,
                    name: "供应商审核",
                    route: "/suppierAudit"
                },
                {
                    id: 11,
                    name: "供应商配置",
                    route: "/suppierConfig"
                },
                {
                    id: 12,
                    name: "供应商列表",
                    route: "/suppierList"
                }
            ]
        },
        {
            name: "商品管理",
            router: "/goods",
            id: 3,
            children: [
                {
                    id: 20,
                    name: "商品审核",
                    route: "/goodsAudit"
                },
                {
                    id: 21,
                    name: "商品配置",
                    route: "/goodsConfig"
                },
                {
                    id: 22,
                    name: "商品列表",
                    route: "/goodsList"
                }
            ]
        }
    ];
    const levelMap = {};

    // 递归生成菜单
    const getMenus = (menuTreeN, siderFoldN) => {
        return menuTreeN.map((item) => {
            if (item.children) {
                if (item.mpid) {
                    levelMap[item.id] = item.mpid;
                }
                return (
                    <Menu.SubMenu
                        key={item.id}
                        title={<span>
                            {item.icon && <Icon type={item.icon} />}
                            {(!siderFoldN || !menuTree.includes(item)) && item.name}
                        </span>}
                    >
                        {getMenus(item.children, siderFoldN)}
                    </Menu.SubMenu>
                );
            }
            return (
                <Menu.Item key={item.id}>
                    <Link to={item.route || '#'}>
                        {item.icon && <Icon type={item.icon} />}
                        {(!siderFoldN || !menuTree.includes(item)) && item.name}
                    </Link>
                </Menu.Item>
            );
        });
    };
    const menuItems = getMenus(menuTree, siderFold);

    // 保持选中
    const getAncestorKeys = (key) => {
        let map = {};
        const getParent = (index) => {
            const result = [String(levelMap[index])];
            if (levelMap[result[0]]) {
                result.unshift(getParent(result[0])[0]);
            }
            return result;
        };
        for (let index in levelMap) {
            if ({}.hasOwnProperty.call(levelMap, index)) {
                map[index] = getParent(index);
            }
        }
        return map[key] || [];
    };

    const onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key));
        const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key));
        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = getAncestorKeys(latestCloseKey);
        }
        changeOpenKeys(nextOpenKeys);
    };

    let menuProps = !siderFold ? {
        onOpenChange,
        openKeys: navOpenKeys,
    } : {};


    // 寻找选中路由
    let currentMenu;
    let defaultSelectedKeys;
    for (let item of menu) {
        if (item.route && pathToRegexp(item.route).exec(location.pathname)) {
            currentMenu = item;
            break;
        }
    }
    const getPathArray = (array, current, pid, id) => {
        let result = [String(current[id])];
        const getPath = (item) => {
            if (item && item[pid]) {
                result.unshift(String(item[pid]));
                getPath(queryArray(array, item[pid], id));
            }
        };
        getPath(current);
        return result;
    };
    if (currentMenu) {
        defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'id');
    }

    if (!defaultSelectedKeys) {
        defaultSelectedKeys = ['1'];
    }
    return (
        <Menu
            {...menuProps}
            mode={siderFold ? 'vertical' : 'inline'}
            theme={darkTheme ? 'dark' : 'light'}
            selectedKeys={defaultSelectedKeys}
            onOpenChange={onOpenChange}
        >
            {menuItems}
        </Menu>
    );
};

Menus.propTypes = {
    menu: PropTypes.array,
    siderFold: PropTypes.bool,
    darkTheme: PropTypes.bool,
    navOpenKeys: PropTypes.array,
    changeOpenKeys: PropTypes.func,
    location: PropTypes.object,
};

export default Menus;
