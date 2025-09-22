const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cargoController');
router.get('/', ctrl.listCargos);
router.get('/:id', ctrl.getCargo);
router.post('/', ctrl.createCargo);
router.put('/:id', ctrl.updateCargo);
router.delete('/:id', ctrl.deleteCargo);
module.exports = router;
