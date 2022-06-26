
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
