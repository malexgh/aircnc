const Spot = require('../models/Spot');
const User = require('../models/User');
const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {
        const { user_id } = req.headers;
        const { spot_id } = req.params;
        const { date } = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(400).json({ error: 'Invalid User!' });
        }
        const spot = await Spot.findById(spot_id);
        if (!spot) {
            return res.status(400).json({ error: 'Invalid Spot!' });
        }
        const booking = await Booking.create({
            user: user_id,
            spot: spot_id,
            date,
        });
        await booking.populate('user').populate('spot').execPopulate();
        res.json(booking);
    },
};
