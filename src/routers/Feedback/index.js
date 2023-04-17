const express = require('express')
const Feedback = require('../../App/controllers/FeedbackController')
const router = express.Router()

router.post('/write',Feedback.write)
router.delete('/delete',Feedback.delete)
router.post('/favourite',Feedback.favourite)
router.get('/show',Feedback.show)

module.exports = router