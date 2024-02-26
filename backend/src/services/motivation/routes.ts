import express from 'express';
import * as controller from './controller';

export const motivationRouter = express.Router();

motivationRouter.post("/create",controller.create);
motivationRouter.get("/getAllByReceiver",controller.getAllByReceiver);
motivationRouter.get("/getAllBySender",controller.getAllBySender);

motivationRouter.post("/randomMessageFromSystem",controller.randomMessageFromSystem);
