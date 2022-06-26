/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from 'views/Dashboard.js';
import UserPage from 'views/UserPage.js';
import Configurator from './views/Configurator';
import WidgetStatus from './views/WidgetStatus';

var dashRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        icon: 'design_app',
        component: Dashboard,
        layout: '/admin',
    },
    {
        path: '/widget-status',
        name: 'Widget Status',
        icon: 'users_single-02',
        component: WidgetStatus,
        layout: '/admin',
    },
    {
        path: '/configurator',
        name: 'Configurator',
        icon: 'users_single-02',
        component: Configurator,
        layout: '/admin',
    },
    {
        path: '/user-page',
        name: 'User Profile',
        icon: 'users_single-02',
        component: UserPage,
        layout: '/admin',
    },
];
export default dashRoutes;
