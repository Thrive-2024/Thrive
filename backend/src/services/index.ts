import express from 'express';
import { testRouter } from './test';

export const services = express.Router();

services.use('/testing', testRouter);