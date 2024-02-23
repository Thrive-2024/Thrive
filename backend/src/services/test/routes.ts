import express from 'express';
import * as controller from './controller';

export const testRouter = express.Router();

testRouter.get("/test",controller.test);
testRouter.put("/test",controller.test);
testRouter.post("/test",controller.test);
testRouter.delete("/test",controller.test);

testRouter.post("/create",controller.create);
