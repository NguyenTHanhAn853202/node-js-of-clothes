const express = require('express')
const Feedback = require('../../App/controllers/FeedbackController')
const uploadFile = require('../../utils/uploadFiles')
const router = express.Router()

router.post('/write',uploadFile().array('imageFeedback',3),Feedback.write)
router.delete('/delete',Feedback.delete)
router.post('/favourite',Feedback.favourite)
router.get('/show',Feedback.show)

module.exports = router