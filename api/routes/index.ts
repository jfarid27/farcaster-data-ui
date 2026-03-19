import express from 'express';
import userScoresRoutes from './user-scores/index.ts';
import dauRoutes from './dau/index.ts';

const routes = [
    {
        path: '/api/user-scores',
        route: userScoresRoutes,
    },
    {
        path: '/api/dau',
        route: dauRoutes,
    },
];

const initRoutes = (app: express.Application) => {
    routes.forEach(route => {
        app.use(route.path, route.route);
    });
};

export default initRoutes;