const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.COULD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export { cloudinary };
