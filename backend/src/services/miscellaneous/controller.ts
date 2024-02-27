import { NextFunction, Request, Response } from 'express';
const DemoModel = require("../../models/demo");
const SampleMessageModel = require("../../models/sampleMessage");
const userModel = require("../../models/user");
const taskModel = require("../../models/task");
const timeTrackedModel = require("../../models/timeTracked");
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
                "lastTask": lastTask
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
        // const leaderboard = await timeTrackedModel.aggregate([
        //     {
        //         $match: {
        //             year: year,
        //             month: month,
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: { email: "$email", year: "$year", month: "$month" },
        //             totalDuration: { $sum: "$durationDay" },
        //             lastUpdated: { $max: "$lastUpdated" }, // Assuming lastUpdated is a sortable field
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "User", // Adjust this to match the user collection name
        //             localField: "_id.email",
        //             foreignField: "email",
        //             as: "userInfo"
        //         }
        //     },
        //     {
        //         $unwind: "$userInfo" // Assuming email will match one user
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             email: "$_id.email",
        //             name: "$userInfo.name", // Adjust this to your user model's name field
        //             year: "$_id.year",
        //             month: "$_id.month",
        //             totalDuration: 1,
        //             lastUpdated: 1,
        //         }
        //     },
        //     { $sort: { totalDuration: -1 } } // Optional: Sort by totalDuration in descending order
        // ]);
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