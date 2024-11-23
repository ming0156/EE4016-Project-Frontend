
import React, { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actionTypes from '../store/actions';
import menuItemList from '../menu-items';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);

    useEffect(() => {
        if (!customization.id) autoHighlightActiveMeunItem();
    }, []);

    const autoHighlightActiveMeunItem = () => {
        if (menuItemList) {
            const checkActive = (list) => {
                for (let i in list) {
                    const item = list[i];
                    if (item.url === window.location.pathname) {
                        return item.id;
                    }
                    if (item.children) {
                        const result = checkActive(item.children);
                        if (result) return result;
                    }
                }
                return null;
            };
            let activeMenuItem = checkActive(menuItemList);
            if (activeMenuItem) dispatch({ type: actionTypes.MENU_OPEN, isOpen: activeMenuItem });
        }
    }

    return <GlobalContext.Provider value={{ autoHighlightActiveMeunItem }}>{children}</GlobalContext.Provider>;
};

export default GlobalContext;