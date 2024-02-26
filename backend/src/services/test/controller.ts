import { NextFunction, Request, Response } from 'express';
const DemoModel = require("../../models/demo");
const SampleMessageModel = require("../../models/sampleMessage");
const getDateTime = require("../../utils/getDateTime");

export const test = async (req: any, res: any, next: NextFunction) => {
    try {
        console.log("calling test method");
        return res.status(200).json({ message: 'Image uploaded successfully.' });

    } catch (error) {
        return res.status(400).json({ message: 'Make sure your input file is valid' });
    }

};


// to create a new record
export const create = async (req: any, res: any, next: NextFunction) => {
    try {
        const data = req.body;
        //check if record already exist
        const record = await DemoModel.findOne({ 'demoID': data.demoID});
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
                    return next(error);
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
                return next(error);
            });
    } catch (error) {
        return res.status(400).json({ message: "Please make sure the input parameters is correct", error: String(error) });
    }
};




