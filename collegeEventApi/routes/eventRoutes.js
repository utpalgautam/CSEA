const express = require('express')
const {
    createEvent,
    registerEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    getAllEvent
} = require('../controllers/eventControllers')

const router = express.Router()

router.post('/create',createEvent)
router.post('/register/:eventId',registerEvent)
router.put('/update/:eventId',updateEvent)
router.delete('/:eventId',deleteEvent)
router.get('/:eventId',getEvent)
router.get('/',getAllEvent)

module.exports = router