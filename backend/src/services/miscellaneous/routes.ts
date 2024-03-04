import express from 'express';
import * as controller from './controller';

export const miscellaneousRouter = express.Router();


// demo create method
miscellaneousRouter.post("/create",controller.create);

//method to insert sample message into SampleMessage
miscellaneousRouter.post("/insertSampleMessage",controller.insertSampleMessage);

//method to insert new user
miscellaneousRouter.get("/getAllUser",controller.getAllUser);
miscellaneousRouter.post("/insertUser",controller.insertUser);
miscellaneousRouter.post("/checkIfUserExist",controller.checkIfUserExist);

//method to insert new friend
miscellaneousRouter.put("/userAddFriend",controller.userAddFriend);

//method for time tracked
miscellaneousRouter.put("/updateTimeTracked",controller.updateTimeTracked);
miscellaneousRouter.get("/getMonthlyLeaderboard",controller.getMonthlyLeaderboard);
miscellaneousRouter.get("/getMonthStatsByEmail",controller.getMonthStatsByEmail);