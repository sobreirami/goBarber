import { Router } from 'express';

import appointmentsRouter from './routes/appointments.routes';
import usersRouter from './routes/user.routes';
import sessionsRouter from './routes/sessions.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;