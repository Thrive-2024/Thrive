import express from 'express';
import { miscellaneousRouter } from './miscellaneous';
import { motivationRouter } from './motivation';
import { taskRouter } from './task';

export const services = express.Router();

services.use('/miscellaneous', miscellaneousRouter);
services.use('/motivation', motivationRouter);
services.use('/task', taskRouter);