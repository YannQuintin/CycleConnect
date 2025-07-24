import express from 'express';
import User from '../models/User';

const router = express.Router();

// Get current user profile
router.get('/profile', async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get user by ID (public profile)
router.get('/:id', async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id)
      .select('profile cycling ratings createdAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user location
router.put('/location', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { coordinates, address, radius } = req.body;

    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'location.coordinates': coordinates,
          'location.address': address,
          'location.radius': radius || 25
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Location updated successfully', location: user.location });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Get nearby users
router.get('/nearby/cyclists', async (req: any, res: any) => {
  try {
    const { latitude, longitude, radius = 25, limit = 20 } = req.query;
    const currentUserId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      'preferences.privacy.showLocation': true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)]
          },
          $maxDistance: parseFloat(radius as string) * 1000 // Convert km to meters
        }
      }
    })
    .select('profile cycling ratings location.address')
    .limit(parseInt(limit as string));

    res.json(users);
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    res.status(500).json({ error: 'Failed to fetch nearby users' });
  }
});

// Delete user account
router.delete('/account', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
