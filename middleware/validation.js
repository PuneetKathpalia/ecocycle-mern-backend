// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = req.validationResult?.errors || [];
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.map(e => ({ field: e.param, message: e.msg }))
    });
  }
  
  next();
};

module.exports = { validateRequest };
