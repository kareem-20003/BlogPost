module.exports = (schema) => (req, res, next) => {
  let validationResult = schema.body.validate(req.body);

  if (validationResult.error)
    return res
      .status(400)
      .json({ message: validationResult.error.details[0].message });

  next();
};
