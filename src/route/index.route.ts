import { Router } from "express";

import accountRoutes from "./account.route";

const apiRouter = Router();

apiRouter.use('/account', accountRoutes);

export default apiRouter;