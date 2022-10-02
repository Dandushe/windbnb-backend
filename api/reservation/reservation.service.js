const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('reservation')
        const reservations = await collection.find(criteria).toArray()
        return reservations
    } catch (err) {
        logger.error('cannot find reservations', err)
        throw err
    }
}

async function getById(reservationId) {
    try {
        const collection = await dbService.getCollection('reservation')
        const reservation = collection.findOne({ _id: ObjectId(reservationId) })
        return reservation
    } catch (err) {
        logger.error(`while finding reservation ${reservationId}`, err)
        throw err
    }
}

async function remove(reservationId) {
    try {
        const collection = await dbService.getCollection('reservation')
        await collection.deleteOne({ _id: ObjectId(reservationId) })
        return reservationId
    } catch (err) {
        logger.error(`cannot remove reservation ${reservationId}`, err)
        throw err
    }
}

async function add(reservation) {
    try {
        const collection = await dbService.getCollection('reservation')
        reservation.createdAt = ObjectId(reservation._id).getTimestamp()
        await collection.insertOne(reservation)
        return reservation
    } catch (err) {
        logger.error('cannot insert reservation', err)
        throw err
    }
}
async function update(reservation) {
    try {
        const id = ObjectId(reservation._id)
        delete reservation._id
        const collection = await dbService.getCollection('reservation')
        await collection.updateOne({ _id: id }, { $set: { ...reservation } })
        return reservation
    } catch (err) {
        logger.error(`cannot update reservation ${reservationId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.buyerId) {
        criteria['buyer._id'] = filterBy.buyerId
    }
    if (filterBy.hostId) {
        criteria['hostId'] = filterBy.hostId
    }
    return criteria
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}