import {Router} from 'express';
import loginRouter from "./login";
import authRouter from "./auth";
import logoutRouter from "./logout";


const userRouter = Router();

userRouter.use('/login', loginRouter);
userRouter.use('/auth', authRouter);
userRouter.use('/logout', logoutRouter);



export default userRouter;
