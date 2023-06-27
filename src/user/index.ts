import {Router} from 'express';
import loginRouter from "./login";
import authRouter from "./auth";


const userRouter = Router();

userRouter.use('/login', loginRouter);
userRouter.use('/auth', authRouter);



export default userRouter;
