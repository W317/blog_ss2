import blogRouter from './blogRoute.js';
import userRouter from './userRoute.js';
import cartRoute from './cartRoute.js';

export default function route(app) {
    app.use('/blog', blogRouter);

    app.use('/cart', cartRoute);

    app.use('/user', userRouter);
}
