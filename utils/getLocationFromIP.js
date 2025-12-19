const axios = require("axios");

const getLocationFromIP = async (ip) => {
  try {
    const res = await axios.get(`https://ipapi.co/${ip}/json/`);

    return {
      city: res.data.city || "Unknown",
      region: res.data.region || "Unknown",
      country: res.data.country_name || "Unknown",
    };
  } catch (error) {
    return {
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
    };
  }
};

module.exports = getLocationFromIP;
