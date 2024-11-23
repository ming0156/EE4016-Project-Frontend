import menuItemList from './menu-items';
import { AnimatePresence } from 'framer-motion';
import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Loader from './component/Loader/Loader';
import config from './config';
import useAuth from './hooks/useAuth';
import MainLayout from './layout/MainLayout';
import MinimalLayout from './layout/MinimalLayout';
import NavMotion from './layout/NavMotion';

const NotFound = lazy(() => import('./views/Pages/Error/Error1')); //404
const Home = lazy(() => import('./views/Home'));
const Record = lazy(() => import('./views/Record'));

const Package = require('../package.json');

const Routes = () => {
    const homeUrl = config.home_url;
    const { menuItem } = useAuth();
    const location = useLocation();
    const paths = useRef([]);

    const genUrlList = (list) => {
        for (let i in list) {
            const item = list[i];
            if (menuItem[item.id] && item.url) paths.current.push(item.url);
            if (item.children) genUrlList(item.children);
        }
    };

    useEffect(() => {
        if (menuItem) genUrlList(menuItemList);
    }, [menuItem]);

    return (
        <AnimatePresence>
            <Suspense fallback={<Loader />}>
                <Redirect exact from="/" to={homeUrl} />
                <Switch>
                    <Route path={paths.current}>
                        <MainLayout>
                            <Switch location={location} key={location.pathname}>
                                <NavMotion>
                                    <Route path="/home" component={Home} />
                                    <Route path="/record" component={Record} />
                                    <div style={{ display: "flex", flexDirection: "row-reverse", fontSize: "9px", position: "relative" }}>{Package.version}</div>
                                </NavMotion>
                            </Switch>
                        </MainLayout>
                    </Route>
                    <Route path={'/'}>
                        <MainLayout>
                            <Switch location={location} key={location.pathname}>
                                <NavMotion>
                                    <Route exact={true} component={NotFound} />
                                </NavMotion>
                            </Switch>
                        </MainLayout>
                    </Route>
                </Switch>
            </Suspense>
        </AnimatePresence>
    );
};

export default Routes;
