const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { generateImage } = require('../services/openai.service');

const createCat = catchAsync(async (req, res) => {
  const cat = await generateImage();
  res.status(httpStatus.CREATED).send(cat);
});

module.exports = {
  createCat,
};
