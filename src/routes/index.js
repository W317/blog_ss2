import docRouter from './doc.js';
import siteRouter from './siteRoute.js';

export default function route(app) {
    app.use('/doc', docRouter);

    app.use('/', siteRouter);
}
