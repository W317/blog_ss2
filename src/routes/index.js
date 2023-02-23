import docRouter from './doc.js';
import siteRouter from './site.js';

export default function route(app) {
    app.use('/doc', docRouter);

    app.use('/', siteRouter);
}
