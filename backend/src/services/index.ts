import express from 'express';
import { testRouter } from './test';
import { motivationRouter } from './motivation';

export const services = express.Router();

services.use('/testing', testRouter);
services.use('/motivation', motivationRouter);