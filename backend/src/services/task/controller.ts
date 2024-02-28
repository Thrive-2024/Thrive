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
        
        const records = await taskModel.find({ ownerEmail: ownerEmail }).sort({ dueDate: 1 }); // sorted by dueDate ascending;;
        
        if (records.length === 0) {
            return res.status(404).json({ message: "No records found for the given owner email" });
        }

        return res.status(200).json({
            message: "Tasks based on owner email",
            data: records
        });
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};

export const updateTaskStatusBulk = async (req: any, res: any, next: NextFunction) => {
    try {
        const updates = req.body; // Expecting an array of objects, each with taskId and newStatus

        // Validate input to ensure it's an array and each item has taskId and newStatus
        if (!Array.isArray(updates) || !updates.every(u => u.taskId && u.newStatus)) {
            return res.status(400).json({ message: "Invalid input format. Expect an array of objects with taskId and newStatus." });
        }

        // Perform updates in bulk
        const bulkOps = updates.map(update => ({
            updateOne: {
                filter: { _id: update.taskId },
                update: { $set: { status: update.newStatus } }
            }
        }));

        const result = await taskModel.bulkWrite(bulkOps);

        return res.status(200).json({
            message: "Tasks status updated successfully",
            details: result
        });
    } catch (error) {
        console.error("Error updating task statuses:", error);
        return res.status(400).json({ message: "An error occurred while updating task statuses", error: String(error) });
    }
};
