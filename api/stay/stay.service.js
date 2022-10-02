const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        const stays = await collection.find(criteria).toArray()
        console.log('dond');
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ _id: ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ _id: ObjectId(stayId) })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        stay.createdAt = ObjectId(stay._id).getTimestamp()
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        return stay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}
async function update(stay) {
    try {
        const id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: id }, { $set: { ...stay } })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${id}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            { name: txtCriteria },
            { 'address.street': txtCriteria },
            { 'address.country': txtCriteria },
            { 'address.city': txtCriteria },
        ]
    }
    if (filterBy.category) {
        const categoryCriteria = { $regex: filterBy.category, $options: 'i' }
        criteria.$or = [{ category: categoryCriteria }]
    }
    if (filterBy.roomTypes?.length) {
        // const roomTypesCriteria = { $regex: filterBy.roomTypes, $options: 'i' }
        // let regexs = filterBy.roomTypes.map(type => new RegExp(type, 'i'))
        criteria.roomType = { $in: filterBy.roomTypes }
    }
    if (filterBy.minPrice || filterBy.maxPrice) {
        criteria.$and = []
        if (filterBy.minPrice) {
            criteria.$and.push({ price: { $gt: filterBy.minPrice } })
        }
        if (filterBy.maxPrice && filterBy.maxPrice !== 1000) {
            criteria.$and.push({ price: { $lt: filterBy.maxPrice } })
        }
    }
    if (filterBy.hostId) {
        criteria['host._id'] = filterBy.hostId

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