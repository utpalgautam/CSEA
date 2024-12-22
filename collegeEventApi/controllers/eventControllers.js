const Event = require('../models/events')

const createEvent = async (req, res) => {
    try {
        const event = new Event(req.body)
        await event.save()
        res.status(200).json({
            success: true,
            message: 'EVENT CREATED SUCCESSFULLY',
            data: event
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'SOMETHING WENT WRONG! PLEASE TRY AGAIN'
        })
    }
}

const registerEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'EVENT NOT FOUND WITH THIS ID'
            })
        } else {
            const registrationData = {
                stduentId:req.body.stduentId,
                name:req.body.name,
                email:req.body.email,
                department:req.body.department,
                year:req.body.year
            }
            event.registration.push(registrationData)
            await event.save()
            res.status(200).json({
                success: true,
                message: 'EVENT REGISTERED SUCCESSFULLY',
                data: event
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'SOMETHING WENT WRONG! PLEASE TRY AGAIN'
        })
    }
}

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.eventId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )

        if (!event) {
            res.status(404).json({
                success: false,
                message: 'EVENT NOT FOUND WITH THIS ID'
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'EVENT UPDATED SUCCESSFULLY',
                data: event
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'SOMETHING WENT WRONG! PLEASE TRY AGAIN'
        })
    }
}

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.eventId)
        if (!event) {
            res.status(404).json({
                success: false,
                message: 'EVENT NOT FOUND WITH THIS ID'
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'EVENT DELETED SUCCESSFULLY',
                data: event
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'SOMETHING WENT WRONG! PLEASE TRY AGAIN'
        })
    }
}

const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
        if (!event) {
            res.status(404).json({
                success: false,
                message: 'EVENT NOT FOUND WITH THIS ID'
            })
        } else {
            res.status(200).json({
                success: true,
                data: event
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'SOMETHING WENT WRONG! PLEASE TRY AGAIN'
        })
    }
}

const getAllEvent = async (req, res) => {
    try {
        const events = await Event.find()
        if (events.length > 0) {
            res.status(200).json({
                success: true,
                message: 'ALL EVENTS FETCHED SUCCESSFULLY',
                data: events
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'NO EVENTS FOUND'
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'SOMETHING WENT WRONG! PLEASE TRY AGAIN'
        })
    }
}

module.exports = { createEvent, registerEvent, updateEvent, deleteEvent, getEvent, getAllEvent }
