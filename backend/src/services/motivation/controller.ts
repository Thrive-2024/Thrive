import { NextFunction, Request, Response } from 'express';
const MotivationModel = require("../../models/motivation");
const SampleMessageModel = require("../../models/sampleMessage");
const getDateTime = require("../../utils/getDateTime");


//Http Post Request : To create a new record
// Parameter needed(pass in as form-data)
// reciver : string
// sender : string
// message : string
// x : int
// y : int
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
                return next(error);
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
        
        const records = await MotivationModel.find({ receiver: receiver });
        
        if (records.length === 0) {
            return res.status(404).json({ message: "No records found for the given receiver" });
        }

        return res.status(200).json(records);
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
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
        
        const records = await MotivationModel.find({ sender: sender });
        
        if (records.length === 0) {
            return res.status(404).json({ message: "No records found for the given sender" });
        }

        return res.status(200).json(records);
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

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
            "sender": "SYSTEM",
            "message": randomMessage.message ,
            "createdDateTime": getDateTime.now()
        });
        // add a new record to mongodb
        newRecord
            .save()
            .then((response: any) => {
                return res.status(200).json({ message: randomMessage.message , systemMessage : `Motivation message created successfully for ${receiver}! Database Record ID : ${response._id}` });
            })
            .catch((error: any) => {
                return next(error);
            });

    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};


