import {Router} from "express";
import {authenticate} from "../middleware/authenticate";
import tradesMain from "./main";
import tradesSpecified from "./specified";

const tradesRouter = Router();

tradesRouter.use(authenticate);
tradesRouter.use('/', tradesMain)
tradesRouter.use('/:id', tradesSpecified)


export default tradesRouter;
