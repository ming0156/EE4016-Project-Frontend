import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import useAuth from '../../../../hooks/useAuth';
import menuItemList from './../../../../menu-items';
import NavGroup from './NavGroup';

const MenuList = () => {
    const { menuItem } = useAuth();

    const genItemList = (list) => {
        for (let i = list.length - 1; i >= 0; i--) {
            list[i]['hide'] = !menuItem[list[i].id];
            // if (!menuItem[list[i].id]) {
            //     list.splice(i, 1);
            // } else if (list[i].children) {
            //     genItemList(list[i].children);
            // }
            if (list[i].children) {
                genItemList(list[i].children);
            }
        }
    };

    useEffect(() => {
        if (menuItem) genItemList(menuItemList);
    }, [menuItem]);

    const navItems = menuItemList.reduce((previous, current) => {
        if (menuItem && menuItem[current.id]) {
            if (current.type === 'group') {
                previous.push(<NavGroup key={current.id} item={current} />);
            } else {
                previous.push(
                    <Typography key={current.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
            }
        }
        return previous;
    }, []);
    return navItems;
};

export default MenuList;
