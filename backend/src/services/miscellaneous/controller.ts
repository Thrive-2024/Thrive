import { NextFunction, Request, Response } from 'express';
const DemoModel = require("../../models/demo");
const SampleMessageModel = require("../../models/sampleMessage");
const userModel = require("../../models/user");
const taskModel = require("../../models/task");
const timeTrackedModel = require("../../models/timeTracked");
const sessonModel = require("../../models/session");
const getDateTime = require("../../utils/getDateTime");

// to create a new record
export const create = async (req: any, res: any, next: NextFunction) => {
    try {
        const data = req.body;
        //check if record already exist
        const record = await DemoModel.findOne({ 'demoID': data.demoID });
        //if record with same elderly id and doc no exists then return error
        if (record == null) {
            //create the DB object
            const newRecord = new DemoModel({
                "demoID": data.demoID,
                "dateTime": getDateTime.now(),
                "name": data.name,
            });
            // add a new record to mongodb
            newRecord
                .save()
                .then((response: any) => {
                    return res.status(200).send({
                        message: `Record ${data.demoID} created successfully`
                    });
                })
                .catch((error: any) => {
                    res.status(400).json({ error: String(error) });
                });
        } else {
            return res
                .status(400)
                .json({
                    message: `Record: ${data.demoID} already exist!`,
                });
        }
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input file is valid type", error: String(error) });
    }
};

export const insertSampleMessage = async (req: any, res: any, next: NextFunction) => {
    try {
        const data = req.body;
        //create the DB object
        const newRecord = new SampleMessageModel({
            "message": data.message,
        });
        // add a new record to mongodb
        newRecord
            .save()
            .then((response: any) => {
                return res.status(200).send({
                    message: `Sample motivation message created successfully! Database Record ID : ${response._id}`
                });
            })
            .catch((error: any) => {
                res.status(400).json({ error: String(error) });
            });
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

export const insertUser = async (req: any, res: any, next: NextFunction) => {
    try {
        const data = req.body;
        //create the DB object
        const newRecord = new userModel({
            "email": data.email,
            "name": data.name
        });
        // add a new record to mongodb
        newRecord
            .save()
            .then((response: any) => {
                return res.status(200).send({
                    message: `User created successfully! Database Record ID : ${response._id}`
                });
            })
            .catch((error: any) => {
                res.status(400).json({ error: String(error) });
            });
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

export const checkIfUserExist = async (req: any, res: any, next: NextFunction) => {
    try {
        const email = req.body.email;
        // Check if the email contains '@'
        if (!email.includes('@')) {
            // If the '@' symbol is missing, return a 404 response
            return res.status(404).json({ message: 'Invalid email format: "@" symbol missing.' });
        }
        const user = await userModel.findOne({ 'email': email }); // Find the user by their email

        if (user != null) {
            return res.status(200).json({ message: `User with email:${email} already existed!` });
        }


        const parts: string[] = email.split('@');
        //create the DB object
        const newRecord = new userModel({
            "email": email,
            "name": parts[0]
        });
        // add a new record to mongodb
        newRecord
            .save()
            .then((response: any) => {
                return res.status(200).send({
                    message: `User created successfully! Database Record ID : ${response._id}`
                });
            })
            .catch((error: any) => {
                res.status(400).json({ error: String(error) });
            });
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

export const getAllUser = async (req: any, res: any, next: NextFunction) => {
    try {
        // Fetch all users from the database
        const users = await userModel.find({});
        // if no users are found
        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }
        // Successfully return the list of all users
        return res.status(200).json({
            message: "User List",
            data: users
        });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while fetching users", error: "Internal Server Error" });
    }
};

export const userAddFriend = async (req: any, res: any, next: NextFunction) => {
    try {
        const { userEmail, friendEmail } = req.body; // Assuming the frontend sends the userId and the friendId to be added
        // const friendEmail = req.body.friendEmail;
        if (!userEmail || !friendEmail) {
            return res.status(400).json({ message: 'Both userId and friendId are required.' });
        }
        const user = await userModel.findOne({ 'email': userEmail }); // Find the user by their ID

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Use the addFriend method
        await user.addFriend(friendEmail);
        return res.status(200).json({ message: 'Friend added successfully' });
    } catch (error: any) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const createTask = async (req: any, res: any, next: NextFunction) => {
    try {
        const data = req.body;
        //create the DB object
        const newRecord = new taskModel({
            "email": data.email,
            "name": data.name
        });
        // add a new record to mongodb
        newRecord
            .save()
            .then((response: any) => {
                return res.status(200).send({
                    message: `User created successfully! Database Record ID : ${response._id}`
                });
            })
            .catch((error: any) => {
                res.status(400).json({ error: String(error) });
            });
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

export const updateTimeTracked = async (req: any, res: any, next: NextFunction) => {
    try {
        const { email, year, month, day, durationDay, lastTask } = req.body;
        const user = await userModel.findOne({ 'email': email }); // Find the user by their ID

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the record is created for today
        const timeTrackedRecord = await timeTrackedModel.findOne({ 'email': email, 'year': year, 'month': month, 'day': day }); // Find the user by their ID
        // if not exists, create
        if (timeTrackedRecord == null) {
            //create the DB object
            const newRecord = new timeTrackedModel({
                "email": email,
                "year": year,
                "month": month,
                "day": day,
                "durationDay": durationDay,
                "lastUpdated": getDateTime.now(),
                "lastTask": lastTask,
                "lastTimeTracked": durationDay
            });
            // add a new record to mongodb
            newRecord
                .save()
                .then((response: any) => {
                    return res.status(200).json({
                        message: `Time tracked  created successfully! Database Record ID : ${response._id}`
                    });
                })
                .catch((error: any) => {
                    res.status(400).json({ error: String(error) });
                });
        } else {
            timeTrackedRecord.durationDay = parseFloat(timeTrackedRecord.durationDay) + parseFloat(durationDay);
            timeTrackedRecord.lastTask = lastTask;
            timeTrackedRecord.lastUpdated = getDateTime.now();
            timeTrackedRecord.lastTimeTracked = durationDay;
            timeTrackedRecord.save();
            return res.status(200).json({ message: 'Time tracked updated successfully' });
        }

    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

export const getMonthlyLeaderboard = async (req: any, res: any, next: NextFunction) => {
    try {
        const year = parseInt(req.query.year, 10);
        const month = parseInt(req.query.month, 10);

        // Aggregation pipeline to group records and sum durationDay
        const leaderboard = await timeTrackedModel.aggregate([
            {
                $match: {
                    year: year,
                    month: month,
                }
            },
            {
                $group: {
                    _id: { email: "$email", year: "$year", month: "$month" },
                    totalDuration: { $sum: "$durationDay" },
                    tasks: {
                        $push: {
                            lastTask: "$lastTask",
                            lastUpdated: "$lastUpdated",
                            lastTimeTracked: "$lastTimeTracked",
                        },
                    },
                }
            },
            {
                $project: {
                    email: "$_id.email",
                    year: "$_id.year",
                    month: "$_id.month",
                    totalDuration: 1,
                    lastTask: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$tasks",
                                    as: "task",
                                    cond: { $eq: ["$$task.lastUpdated", { $max: "$tasks.lastUpdated" }] },
                                },
                            },
                            0,
                        ],
                    },
                }
            },
            {
                $lookup: {
                    from: "User",
                    localField: "email",
                    foreignField: "email",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    _id: 0,
                    email: 1,
                    name: "$userInfo.name",
                    year: 1,
                    month: 1,
                    lastTimeTracked: "$lastTask.lastTimeTracked",
                    lastUpdated: "$lastTask.lastUpdated",
                    totalDuration: 1,
                    lastTask: "$lastTask.lastTask",
                }
            },
            { $sort: { totalDuration: -1 } }
        ]);

        return res.status(200).json({
            message: "Monthly leaderboard",
            data: leaderboard
        });
    } catch (error) {
        console.error("Error getting monthly leaderboard:", error);
        return res.status(400).json({ message: "Please make sure the input parameters are correct", error: String(error) });
    }
};

export const getMonthStatsByEmail = async (req: any, res: any, next: NextFunction) => {
    try {
        const { email, year, month } = req.query;
        const user = await userModel.findOne({ 'email': email }); // Find the user by their ID

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the record is created for today
        const timeTrackedRecord = await timeTrackedModel.find({ 'email': email, 'year': year, 'month': month }).sort({ day: 1 }); // Sort by day in ascending order

        if (timeTrackedRecord == null) {
            return res.status(404).json({ message: 'User does not have any records for the month!' });
        }
        return res.status(200).json({
            message: "Monthly stats",
            data: timeTrackedRecord
        });

    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

export const updateSession = async (req: any, res: any, next: NextFunction) => {
    try {
        const { email, year, month, day, numOfSession } = req.body;
        const user = await userModel.findOne({ 'email': email }); // Find the user by their ID

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the record is created for today
        const record = await sessonModel.findOne({ 'email': email, 'year': year, 'month': month, 'day': day }); // Find the user by their ID
        // if not exists, create
        if (record == null) {
            //create the DB object
            const newRecord = new sessonModel({
                "email": email,
                "year": year,
                "month": month,
                "day": day,
                "totalNumOfSession": numOfSession,
                "lastNumOfSession":numOfSession,
                "lastUpdated": getDateTime.now()
            });
            // add a new record to mongodb
            newRecord
                .save()
                .then((response: any) => {
                    return res.status(200).json({
                        message: `Number of session  created successfully! Database Record ID : ${response._id}`
                    });
                })
                .catch((error: any) => {
                    res.status(400).json({ error: String(error) });
                });
        } else {
            record.totalNumOfSession = parseFloat(record.totalNumOfSession) + parseFloat(numOfSession);
            record.lastUpdated = getDateTime.now();
            record.lastNumOfSession = numOfSession;
            record.save();
            return res.status(200).json({ message: 'Number of session updated successfully' });
        }

    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};