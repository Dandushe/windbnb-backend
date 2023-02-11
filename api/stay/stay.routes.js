const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addStay, getStays, getStayById, updateStay, removeStay } = require('./stay.controller')

const router = express.Router()

router.get('/', getStays)
router.get('/:id', getStayById)
router.post('/', log, requireAuth, addStay)
router.put('/', requireAuth, updateStay)
router.delete('/:id', requireAuth, removeStay)

module.exports = router