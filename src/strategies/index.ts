import {Router} from "express";
import {authenticate} from "../middleware/authenticate";
import strategiesMain from "./main";
import strategiesSpecified from "./specified";

const strategiesRouter = Router();

// Apply authMiddleware to the entire strategiesRouter
strategiesRouter.use(authenticate);
strategiesRouter.use('/', strategiesMain)
strategiesRouter.use('/', strategiesSpecified)


export default strategiesRouter;
