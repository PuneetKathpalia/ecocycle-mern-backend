require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const PickupRequest = require('../models/PickupRequest');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Service.deleteMany({});
    await PickupRequest.deleteMany({});
    console.log('🗑️ Cleared existing data');
    const admin = new User({
      firstName: 'Admin',
      lastName: 'EcoCycle',
      email: 'admin@ecocycle.com',
      password: 'admin123',
      phone: '9999999999',
      address: 'Admin Office',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      role: 'admin',
      isVerified: true
    });
    await admin.save();
    console.log('✅ Admin user created');
    const user1 = new User({
      firstName: 'Raj',
      lastName: 'Kumar',
      email: 'raj@email.com',
      password: 'user123',
      phone: '9876543210',
      address: '123 Tech Street, Apartment 4B',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      role: 'user',
      isVerified: true
    });
    await user1.save();

    const user2 = new User({
      firstName: 'Priya',
      lastName: 'Singh',
      email: 'priya@email.com',
      password: 'user123',
      phone: '9765432101',
      address: '456 Innovation Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      role: 'user',
      isVerified: true
    });
    await user2.save();

    const user3 = new User({
      firstName: 'Amit',
      lastName: 'Patel',
      email: 'amit@email.com',
      password: 'user123',
      phone: '9654321012',
      address: '789 Business Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      role: 'user',
      isVerified: true
    });
    await user3.save();
    console.log('✅ Regular users created');

    const collector1 = new User({
      firstName: 'Green',
      lastName: 'Recyclers',
      email: 'green@recyclers.com',
      password: 'collector123',
      phone: '8765432109',
      address: 'Green House, 101',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560002',
      role: 'collector',
      isVerified: true,
      idProof: 'https://via.placeholder.com/150',
      verificationNotes: 'Verified by admin'
    });
    await collector1.save();

    const collector2 = new User({
      firstName: 'EcoWaste',
      lastName: 'Solutions',
      email: 'eco@waste.com',
      password: 'collector123',
      phone: '8654321098',
      address: 'Eco Center, Block A',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411002',
      role: 'collector',
      isVerified: true,
      idProof: 'https://via.placeholder.com/150',
      verificationNotes: 'Verified by admin'
    });
    await collector2.save();

    const collector3 = new User({
      firstName: 'Tech',
      lastName: 'Collectors',
      email: 'tech@collectors.com',
      password: 'collector123',
      phone: '8543210987',
      address: 'Tech Park, Building 3',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      role: 'collector',
      isVerified: true,
      idProof: 'https://via.placeholder.com/150',
      verificationNotes: 'Verified by admin'
    });
    await collector3.save();

    const collectorUnverified = new User({
      firstName: 'Pending',
      lastName: 'Collector',
      email: 'pending@collector.com',
      password: 'collector123',
      phone: '8432109876',
      address: 'Pending Office',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110002',
      role: 'collector',
      isVerified: false,
      idProof: 'https://via.placeholder.com/150'
    });
    await collectorUnverified.save();
    console.log('✅ Collector users created');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const service1 = new Service({
      collector: collector1._id,
      serviceName: 'E-Waste Pickup Service',
      description: 'Professional e-waste collection and recycling service. We handle all types of electronic waste safely and responsibly.',
      location: '123 Green Lane, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560002',
      eWasteTypes: ['Mobile Phones', 'Laptops', 'Chargers', 'Cables'],
      availableDates: [
        { date: tomorrow, timeSlot: 'Morning (6AM-12PM)', capacity: 10 },
        { date: dayAfter, timeSlot: 'Afternoon (12PM-6PM)', capacity: 8 }
      ],
      isActive: true,
      rating: 4.5,
      totalRatings: 12
    });
    await service1.save();

    const service2 = new Service({
      collector: collector2._id,
      serviceName: 'Eco-Friendly Recycling',
      description: 'Environment-friendly e-waste disposal with certified recycling partners. Free pickup for bulk items.',
      location: '456 Eco Road, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411002',
      eWasteTypes: ['Desktop Computers', 'Monitors', 'Keyboards', 'Mice', 'Printers'],
      availableDates: [
        { date: tomorrow, timeSlot: 'Afternoon (12PM-6PM)', capacity: 12 },
        { date: dayAfter, timeSlot: 'Evening (6PM-12AM)', capacity: 6 }
      ],
      isActive: true,
      rating: 4.8,
      totalRatings: 25
    });
    await service2.save();

    const service3 = new Service({
      collector: collector3._id,
      serviceName: 'Tech Device Recycling',
      description: 'Specialized in high-tech device recycling. Data wiping and secure disposal guaranteed.',
      location: '789 Tech Plaza, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      eWasteTypes: ['Tablets', 'Cameras', 'Headphones', 'Mobile Phones'],
      availableDates: [
        { date: tomorrow, timeSlot: 'Morning (6AM-12PM)', capacity: 15 },
        { date: dayAfter, timeSlot: 'Afternoon (12PM-6PM)', capacity: 10 }
      ],
      isActive: true,
      rating: 4.3,
      totalRatings: 18
    });
    await service3.save();
    console.log('✅ Services created');

    const pickupRequest1 = new PickupRequest({
      user: user1._id,
      service: service1._id,
      collector: collector1._id,
      eWasteItems: ['Old Samsung Phone', 'Phone Charger'],
      description: 'Have an old smartphone and charger that need recycling',
      pickupDate: tomorrow,
      timeSlot: 'Morning (6AM-12PM)',
      pickupAddress: '123 Tech Street, Apartment 4B, Bangalore',
      status: 'approved',
      collectorNotes: 'Will pickup tomorrow morning',
      rating: 5,
      feedback: 'Excellent service! Very professional and prompt.'
    });
    await pickupRequest1.save();

    const pickupRequest2 = new PickupRequest({
      user: user2._id,
      service: service2._id,
      collector: collector2._id,
      eWasteItems: ['Old Dell Monitor', 'Wireless Keyboard and Mouse'],
      description: 'Computer peripherals no longer in use',
      pickupDate: dayAfter,
      timeSlot: 'Afternoon (12PM-6PM)',
      pickupAddress: '456 Innovation Road, Pune',
      status: 'pending',
      userNotes: 'Items are in good condition'
    });
    await pickupRequest2.save();

    const pickupRequest3 = new PickupRequest({
      user: user3._id,
      service: service3._id,
      collector: collector3._id,
      eWasteItems: ['Old Laptop', 'Headphones', 'Camera'],
      description: 'Multiple electronic items for recycling',
      pickupDate: tomorrow,
      timeSlot: 'Afternoon (12PM-6PM)',
      pickupAddress: '789 Business Complex, Mumbai',
      status: 'completed',
      weight: 5.5,
      images: ['https://via.placeholder.com/200'],
      rating: 4,
      feedback: 'Good service, items were properly handled'
    });
    await pickupRequest3.save();
    console.log('✅ Pickup requests created');

    console.log('\n✅ ✅ ✅ Seed data created successfully! ✅ ✅ ✅\n');
    console.log('Test Credentials:');
    console.log('- Admin: admin@ecocycle.com / admin123');
    console.log('- User: raj@email.com / user123');
    console.log('- Collector: green@recyclers.com / collector123');
    console.log('- Unverified Collector: pending@collector.com / collector123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
