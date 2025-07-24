import express from 'express';
import { body, validationResult } from 'express-validator';
import Ride from '../models/Ride';
import User from '../models/User';

const router = express.Router();

// Get nearby rides
router.get('/nearby', async (req: any, res: any) => {
  try {
    const { latitude, longitude, radius = 25, limit = 20 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const rides = await Ride.find({
      'route.startPoint': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)]
          },
          $maxDistance: parseFloat(radius as string) * 1000 // Convert km to meters
        }
      },
      status: 'scheduled',
      'schedule.startTime': { $gte: new Date() }
    })
    .populate('organizer', 'profile.firstName profile.lastName profile.profileImage cycling.experienceLevel')
    .limit(parseInt(limit as string))
    .sort({ 'schedule.startTime': 1 });

    res.json(rides);
  } catch (error) {
    console.error('Error fetching nearby rides:', error);
    res.status(500).json({ error: 'Failed to fetch nearby rides' });
  }
});

// Get all rides with filters
router.get('/', async (req: any, res: any) => {
  try {
    const { 
      rideType, 
      difficulty, 
      status = 'scheduled',
      limit = 20,
      page = 1 
    } = req.query;

    const filter: any = { status };
    
    if (rideType) filter.rideType = rideType;
    if (difficulty) filter.difficulty = difficulty;
    
    // Only show future rides for scheduled status
    if (status === 'scheduled') {
      filter['schedule.startTime'] = { $gte: new Date() };
    }

    const rides = await Ride.find(filter)
      .populate('organizer', 'profile.firstName profile.lastName profile.profileImage cycling.experienceLevel')
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ 'schedule.startTime': 1 });

    const total = await Ride.countDocuments(filter);

    res.json({
      rides,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// Get ride by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('organizer', 'profile.firstName profile.lastName profile.profileImage cycling.experienceLevel ratings')
      .populate('participants.confirmed', 'profile.firstName profile.lastName profile.profileImage cycling.experienceLevel')
      .populate('participants.pending', 'profile.firstName profile.lastName profile.profileImage cycling.experienceLevel');

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.json(ride);
  } catch (error) {
    console.error('Error fetching ride:', error);
    res.status(500).json({ error: 'Failed to fetch ride' });
  }
});

// Create new ride
router.post('/', [
  body('title').isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('rideType').isIn(['road', 'mountain', 'gravel', 'commute', 'leisure']),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  body('route.startPoint.coordinates').isArray({ min: 2, max: 2 }),
  body('route.startPoint.address').notEmpty(),
  body('schedule.startTime').isISO8601().withMessage('Invalid start time'),
  body('participants.maxParticipants').isInt({ min: 2, max: 50 })
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const rideData = {
      ...req.body,
      organizer: req.user.id
    };

    const ride = new Ride(rideData);
    await ride.save();
    
    await ride.populate('organizer', 'profile.firstName profile.lastName profile.profileImage cycling.experienceLevel');
    
    res.status(201).json(ride);
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(400).json({ error: 'Failed to create ride' });
  }
});

// Join ride
router.post('/:id/join', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if user is the organizer
    if (ride.organizer.toString() === userId) {
      return res.status(400).json({ error: 'Organizer cannot join their own ride' });
    }

    // Check if user is already in the ride
    if (ride.participants.confirmed.includes(userId) || 
        ride.participants.pending.includes(userId)) {
      return res.status(400).json({ error: 'Already joined this ride' });
    }

    // Check capacity
    if (ride.participants.confirmed.length >= ride.participants.maxParticipants) {
      if (ride.settings.allowWaitlist) {
        ride.participants.pending.push(userId);
        await ride.save();
        return res.json({ message: 'Added to waitlist' });
      } else {
        return res.status(400).json({ error: 'Ride is full' });
      }
    }

    // Add to confirmed or pending based on approval setting
    if (ride.settings.requireApproval) {
      ride.participants.pending.push(userId);
      await ride.save();
      res.json({ message: 'Join request sent for approval' });
    } else {
      ride.participants.confirmed.push(userId);
      await ride.save();
      res.json({ message: 'Successfully joined ride' });
    }
  } catch (error) {
    console.error('Error joining ride:', error);
    res.status(500).json({ error: 'Failed to join ride' });
  }
});

// Leave ride
router.post('/:id/leave', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Remove from confirmed or pending
    ride.participants.confirmed = ride.participants.confirmed.filter(
      participantId => participantId.toString() !== userId
    );
    ride.participants.pending = ride.participants.pending.filter(
      participantId => participantId.toString() !== userId
    );

    await ride.save();
    res.json({ message: 'Successfully left ride' });
  } catch (error) {
    console.error('Error leaving ride:', error);
    res.status(500).json({ error: 'Failed to leave ride' });
  }
});

// Get user's rides
router.get('/user/my-rides', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { status, type = 'all' } = req.query;

    let filter: any = {};
    
    if (type === 'organized') {
      filter.organizer = userId;
    } else if (type === 'joined') {
      filter['participants.confirmed'] = userId;
    } else {
      // All rides (organized or joined)
      filter.$or = [
        { organizer: userId },
        { 'participants.confirmed': userId }
      ];
    }

    if (status) {
      filter.status = status;
    }

    const rides = await Ride.find(filter)
      .populate('organizer', 'profile.firstName profile.lastName profile.profileImage')
      .sort({ 'schedule.startTime': -1 });

    res.json(rides);
  } catch (error) {
    console.error('Error fetching user rides:', error);
    res.status(500).json({ error: 'Failed to fetch user rides' });
  }
});

export default router;
