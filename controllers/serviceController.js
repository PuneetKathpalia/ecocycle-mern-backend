const Service = require('../models/Service');

exports.createService = async (req, res) => {
  try {
    const { serviceName, description, location, city, state, pincode, eWasteTypes, availableDates } = req.body;

    // Validation
    if (!serviceName || !description || !location || !city || !state || !pincode || !eWasteTypes || !availableDates) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newService = new Service({
      collector: req.user.id,
      serviceName,
      description,
      location,
      city,
      state,
      pincode,
      eWasteTypes,
      availableDates
    });

    await newService.save();
    await newService.populate('collector', 'firstName lastName email phone');

    res.status(201).json({
      message: 'Service created successfully',
      service: newService
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getAllServices = async (req, res) => {
  try {
    const { city, eWasteType, date } = req.query;
    let filter = { isActive: true };

    if (city) {
      filter.city = new RegExp(city, 'i');
    }

    if (eWasteType) {
      filter.eWasteTypes = eWasteType;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter['availableDates.date'] = { $gte: startDate, $lt: endDate };
    }

    const services = await Service.find(filter)
      .populate('collector', 'firstName lastName email phone city address')
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId).populate('collector', 'firstName lastName email phone city address');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCollectorServices = async (req, res) => {
  try {
    const services = await Service.find({ collector: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    console.error('Get collector services error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { serviceName, description, location, city, state, pincode, eWasteTypes, availableDates, isActive } = req.body;

    const service = await Service.findOne({ _id: serviceId, collector: req.user.id });

    if (!service) {
      return res.status(404).json({ message: 'Service not found or unauthorized' });
    }

    Object.assign(service, {
      serviceName,
      description,
      location,
      city,
      state,
      pincode,
      eWasteTypes,
      availableDates,
      isActive,
      updatedAt: Date.now()
    });

    await service.save();

    res.status(200).json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findOneAndDelete({ _id: serviceId, collector: req.user.id });

    if (!service) {
      return res.status(404).json({ message: 'Service not found or unauthorized' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
