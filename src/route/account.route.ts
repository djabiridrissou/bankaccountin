import { Router } from "express";
import AccountController from "../controller/Account.controller";

const accountRoutes = Router();
const controller = new AccountController();

accountRoutes.get('/save', controller.createFromXlsxHandler);
accountRoutes.get('/all', controller.loadAllHandler);
// accountRoutes.get('/season/:season', controller.loadBySeasonHandler);

accountRoutes.get('/get/:id', controller.loadByIdHandler);

export default accountRoutes;