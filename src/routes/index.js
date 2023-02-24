import docRouter from './doc.js';
import siteRouter from './siteRoute.js';
import userRouter from './userRoute.js';

export default function route(app) {
    app.use('/doc', docRouter);

    app.use('/', siteRouter);

    app.use('/user', userRouter);
}
