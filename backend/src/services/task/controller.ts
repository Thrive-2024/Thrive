import { NextFunction, Request, Response } from 'express';
const taskModel = require("../../models/task");
const usermodel = require("../../models/user");

export const create = async (req: any, res: any, next: NextFunction) => {
    try {
        const data = req.body;
        const user = await usermodel.findOne({ 'email': data.ownerEmail});
        if(user == null) {
            res.status(400).json({ message : "User not found!"});
        }

        //create the DB object
        const newRecord = new taskModel({
            "ownerEmail": data.ownerEmail,
            "taskName": data.taskName, 
            "subjectName": data.subjectName,
            "colour": data.colour, 
            "dueDate": data.dueDate,
            "status": data.status, 
            "notes": data.notes? data.notes: "",  // optional, is not passed in, default as ""
        });
        // add a new record to mongodb
        newRecord
            .save()
            .then((response: any) => {
                return res.status(200).send({
                    message: `Task created successfully! Database Record ID : ${response._id}`
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
// {{dev_url}}/api/task/getAllByOwner?ownerEmail={james@gmail.com}
export const getAllByOwner = async (req: any, res: any, next: NextFunction) => {
    try {
        const ownerEmail = req.query.ownerEmail; // Assuming receiver is passed as a query parameter
        if (!ownerEmail) {
            return res.status(400).json({ message: "Owner email is required" });
        }
        
        const records = await taskModel.find({ ownerEmail: ownerEmail });
        
        if (records.length === 0) {
            return res.status(404).json({ message: "No records found for the given owner email" });
        }

        return res.status(200).json(records);
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};


