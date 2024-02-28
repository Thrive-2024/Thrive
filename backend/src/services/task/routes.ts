import express from 'express';
import * as controller from './controller';

export const taskRouter = express.Router();


// Task create method
taskRouter.post("/create",controller.create);
taskRouter.get("/getAllByOwner",controller.getAllByOwner);
taskRouter.put("/updateTaskStatusBulk",controller.updateTaskStatusBulk);