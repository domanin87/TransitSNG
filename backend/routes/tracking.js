const express = require('express');
const Cargo = require('../models/Cargo');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Update driver location
router.post('/location', authMiddleware, async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Update driver's current location
    await User.findByIdAndUpdate(req.userId, {
      'driverProfile.currentLocation': {
        lat,
        lng,
        updatedAt: new Date()
      }
    });

    // If driver has assigned cargo, update cargo location too
    const assignedCargo = await Cargo.findOne({
      'assignedTo.driver': req.userId,
      status: { $in: ['assigned', 'in_transit'] }
    });

    if (assignedCargo) {
      assignedCargo.tracking.currentLocation = { lat, lng, timestamp: new Date() };
      assignedCargo.tracking.route.push({
        lat,
        lng,
        timestamp: new Date(),
        description: 'Location update'
      });
      await assignedCargo.save();

      // Emit real-time location update
      req.app.get('io').to(assignedCargo._id.toString()).emit('locationUpdate', {
        cargoId: assignedCargo._id,
        location: { lat, lng },
        timestamp: new Date()
      });
    }

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cargo tracking information
router.get('/cargo/:cargoId', authMiddleware, async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.cargoId)
      .populate('assignedTo.driver', 'name phone avatar driverProfile')
      .select('tracking assignedTo status');

    if (!cargo) {
      return res.status(404).json({ error: 'Cargo not found' });
    }

    // Check if user has access to this cargo
    if (cargo.createdBy.toString() !== req.userId && 
        (!cargo.assignedTo.driver || cargo.assignedTo.driver._id.toString() !== req.userId) &&
        req.userRole !== 'admin' && req.userRole !== 'moderator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ tracking: cargo.tracking });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update estimated arrival time
router.put('/cargo/:cargoId/eta', authMiddleware, async (req, res) => {
  try {
    const { eta } = req.body;

    const cargo = await Cargo.findOne({
      _id: req.params.cargoId,
      'assignedTo.driver': req.userId
    });

    if (!cargo) {
      return res.status(404).json({ error: 'Cargo not found or access denied' });
    }

    cargo.tracking.estimatedArrival = new Date(eta);
    await cargo.save();

    // Notify cargo owner about ETA update
    req.app.get('io').to(cargo._id.toString()).emit('etaUpdate', {
      cargoId: cargo._id,
      eta: cargo.tracking.estimatedArrival
    });

    res.json({ message: 'ETA updated successfully', eta: cargo.tracking.estimatedArrival });
  } catch (error) {
    console.error('Update ETA error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;