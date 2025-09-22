const express = require('express'); const router = express.Router(); const ctrl = require('../controllers/paymentsController');
router.post('/kaspi', ctrl.createKaspi); router.post('/halyk', ctrl.createHalyk);
module.exports = router;