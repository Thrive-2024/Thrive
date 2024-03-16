import { NextFunction, Request, Response } from 'express';
const MotivationModel = require("../../models/motivation");
const SampleMessageModel = require("../../models/sampleMessage");
const getDateTime = require("../../utils/getDateTime");
const userModel = require("../../models/user");

//Http Post Request : To create a new record
// Parameter needed(pass in as form-data)
// reciver : string
// sender : string
// message : string
// x : int
// y : int
// variant: int
export const create = async (req: any, res: any, next: NextFunction) => {
    try {
        const data = req.body;
        //create the DB object
        const newRecord = new MotivationModel({
            "receiver": data.receiver,
            "sender": data.sender,
            "message": data.message,
            "createdDateTime": getDateTime.now(),
            "x": data.x,
            "y": data.y,
            "variant": data.variant,
        });
        // add a new record to mongodb
        newRecord
            .save()
            .then((response: any) => {
                return res.status(200).json({
                    message: `Motivation message created successfully! Database Record ID : ${response._id}`
                });
            })
            .catch((error: any) => {
                res.status(400).json({ error: String(error) });
            });
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

//Http Get Request
// {{dev_url}}/api/motivation/getAllByReceiver?receiver={receiver email}
export const getAllByReceiver = async (req: any, res: any, next: NextFunction) => {
    try {
        const receiver = req.query.receiver; // Assuming receiver is passed as a query parameter
        if (!receiver) {
            return res.status(400).json({ message: "Receiver is required" });
        }

        // Using aggregation to include name from userModel
        const records = await MotivationModel.aggregate([
            { $match: { receiver: receiver } },
            // Lookup for receiver's name
            {
                $lookup: {
                    from: "User", // Assuming your userModel is tied to a MongoDB collection named 'User'
                    localField: "receiver", // The field in MotivationModel to match
                    foreignField: "email", // Assuming the receiver is identified by email in userModel
                    as: "userInfo" // The array to put the matched document(s) from userModel
                }
            },
            {
                $unwind: "$userInfo" // Convert userInfo array to an object (assuming one-to-one relationship)
            },
             // Lookup for sender's name
             {
                $lookup: {
                    from: "User", // Adjust this if your collection name is different
                    localField: "sender", // Adjust if your field for matching sender in MotivationModel is different
                    foreignField: "email", // Adjust if your userModel identifier field is different
                    as: "senderInfo"
                }
            },
            {
                $unwind: "$senderInfo"
            },
            {
                $addFields: {
                    "senderName": "$senderInfo.name", 
                    "receiverName": "$userInfo.name", // Assuming 'name' is the field you want from userModel
                }
            },
            {
                $sort: { createdDateTime: -1 } // Sorting by createdDateTime descending
            },
            {
                $project: {
                    userInfo: 0, // Optionally exclude userInfo from final output if you don't want to include all user details
                    senderInfo: 0,
                }
            }
        ]);

        if (records.length === 0) {
            return res.status(404).json({ message: "No records found for the given receiver" });
        }

        return res.status(200).json({
            message: "Motivation message records by receiver",
            data: records
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(400).json({ message: "Please make sure the input parameters are correct", error: String(error) });
    }
};

//Http Get Request
// {{dev_url}}/api/motivation/getAllBySender?sender={sender email}
export const getAllBySender = async (req: any, res: any, next: NextFunction) => {
    try {
        const sender = req.query.sender; // Assuming sender is passed as a query parameter
        if (!sender) {
            return res.status(400).json({ message: "sender is required" });
        }

        const records = await MotivationModel.find({ sender: sender }).sort({ createdDateTime: -1 }); // sorted by createdDateTime descending

        if (records.length === 0) {
            return res.status(404).json({ message: "No records found for the given sender" });
        }

        return res.status(200).json({
            message: "Motivation message records by sender",
            data: records
        });
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

function getRandomInt(min: any, max : any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

//Http Post Request : for extension to call, to generate random motivation message
//{{dev_url}}/api/motivation/randomMessageFromSystem?receiver=james@gmail.com
export const randomMessageFromSystem = async (req: any, res: any, next: NextFunction) => {
    try {
        const receiver = req.query.receiver; // Assuming receiver is passed as a query parameter
        if (!receiver) {
            return res.status(400).json({ message: "Receiver is required" });
        }

        const messages = await SampleMessageModel.find();

        if (messages.length === 0) {
            return res.status(404).json({ message: "No records found for the given sender" });
        }
        // Randomly select one message
        const randomIndex = Math.floor(Math.random() * messages.length);
        const randomMessage = messages[randomIndex];

        // create the message for the receiver from system
        const newRecord = new MotivationModel({
            "receiver": receiver,
            "sender": "thrive@gmail.com",
            "message": randomMessage.message,
            "createdDateTime": getDateTime.now(),
            "variant": getRandomInt(1,5)
        });
        // add a new record to mongodb
        newRecord
            .save()
            .then((response: any) => {
                return res.status(200).json({ message: randomMessage.message, systemMessage: `Motivation message created successfully for ${receiver}! Database Record ID : ${response._id}` });
            })
            .catch((error: any) => {
                res.status(400).json({ error: String(error) });
            });

    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};



