import AppContainer from 'containers/App';
import { RouteConfig } from 'react-router-config';

const rootRoutes: RouteConfig[] = [
    {
        path: '/',
        exact: true,
        restricted: false,
        component: AppContainer
    }
];

export default rootRoutes;
