const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/transportController');
router.get('/', ctrl.listTransports);
router.post('/', ctrl.createTransport);
module.exports = router;
