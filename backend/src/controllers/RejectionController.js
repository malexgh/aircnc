const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {
        const { booking_id } = req.params;
        const booking = await Booking.findById(booking_id).populate('spot');
        if (!booking) {
            return res.status(400).json({error: 'Invalid booking!'});
        }
        const spotOwner = booking.spot.user;
        const { user_id } = req.headers;
        if (spotOwner != user_id) {
            return res.status(401).json({error: 'Invalid user!'});
        }
        booking.approved = false;
        await booking.save();
        const bookingUserSocket = req.connectedUsers[booking.user];
        if (bookingUserSocket) {
            req.io.to(bookingUserSocket).emit('booking_response', booking);
        }
        return res.status(201).json(booking);
    }
}
