const reservationService = require('./reservation.service.js');
const logger = require('../../services/logger.service')


// GET LIST
async function getReservations(req, res) {
  try {
    logger.debug('Getting Reservations')
    const queryParams = req.query
    const reservations = await reservationService.query(queryParams)
    res.json(reservations)
  } catch (err) {
    logger.error('Failed to get reservations', err)
    res.status(500).send({ err: 'Failed to get reservations' })
  }
}

// GET BY ID 
async function getReservationById(req, res) {
  try {
    const reservationId = req.params.id
    const reservation = await reservationService.getById(reservationId)
    res.json(reservation)
  } catch (err) {
    logger.error('Failed to get reservation', err)
    res.status(500).send({ err: 'Failed to get reservation' })
  }
}

// POST (add reservation)
async function addReservation(req, res) {
  try {
    const reservation = req.body
    const addedReservation = await reservationService.add(reservation)
    res.json(addedReservation)
  } catch (err) {
    logger.error('Failed to add reservation', err)
    res.status(500).send({ err: 'Failed to add reservation' })
  }
}

// PUT (Update reservation)
async function updateReservation(req, res) {
  try {
    const reservation = req.body;
    const updatedReservation = await reservationService.update(reservation)
    res.json(updatedReservation)
  } catch (err) {
    logger.error('Failed to update reservation', err)
    res.status(500).send({ err: 'Failed to update reservation' })

  }
}

async function removeReservation(req, res) {
  try {
    const reservationId = req.params.id;
    const removedId = await reservationService.remove(reservationId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove reservation', err)
    res.status(500).send({ err: 'Failed to remove reservation' })
  }
}

module.exports = {
  getReservations,
  getReservationById,
  addReservation,
  updateReservation,
  removeReservation
}
