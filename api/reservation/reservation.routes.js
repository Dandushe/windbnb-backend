const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addReservation, getReservations, removeReservation, getReservationById, updateReservation } = require('./reservation.controller')
const router = express.Router()

router.use(log)
router.use(requireAuth)

router.get('/', getReservations)
router.get('/:id', getReservationById)
router.post('/', addReservation)
router.put('/', updateReservation)
router.delete('/:id', removeReservation)

module.exports = router