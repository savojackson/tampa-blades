// Input validation middleware
const validator = require("validator");

// Validate email format
function validateEmail(email) {
  return validator.isEmail(email);
}

// Validate username (alphanumeric, 3-20 characters)
function validateUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

// Validate password strength
function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(password);
}

// Validate latitude (-90 to 90)
function validateLatitude(lat) {
  const latitude = parseFloat(lat);
  return !isNaN(latitude) && latitude >= -90 && latitude <= 90;
}

// Validate longitude (-180 to 180)
function validateLongitude(lng) {
  const longitude = parseFloat(lng);
  return !isNaN(longitude) && longitude >= -180 && longitude <= 180;
}

// Sanitize text input
function sanitizeText(text) {
  if (typeof text !== "string") return "";
  return text.trim().replace(/[<>]/g, "");
}

// Validation middleware for user registration
function validateRegistration(req, res, next) {
  const { username, email, password } = req.body;

  const errors = [];

  if (!username || !validateUsername(username)) {
    errors.push(
      "Username must be 3-20 characters and contain only letters, numbers, and underscores"
    );
  }

  if (!email || !validateEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!password || !validatePassword(password)) {
    errors.push(
      "Password must be at least 8 characters with uppercase, lowercase, and number"
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(", ") });
  }

  // Sanitize inputs
  req.body.username = sanitizeText(username);
  req.body.email = email.toLowerCase().trim();

  next();
}

// Validation middleware for skate spot submission
function validateSkateSpot(req, res, next) {
  const { name, type, difficulty, latitude, longitude, description } = req.body;

  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push("Spot name must be at least 3 characters");
  }

  if (!type || !["park", "street", "trail", "bowl"].includes(type)) {
    errors.push("Spot type must be one of: park, street, trail, bowl");
  }

  if (
    !difficulty ||
    !["beginner", "intermediate", "advanced", "expert"].includes(difficulty)
  ) {
    errors.push(
      "Difficulty must be one of: beginner, intermediate, advanced, expert"
    );
  }

  if (!validateLatitude(latitude)) {
    errors.push("Invalid latitude coordinate");
  }

  if (!validateLongitude(longitude)) {
    errors.push("Invalid longitude coordinate");
  }

  if (description && description.length > 1000) {
    errors.push("Description must be less than 1000 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(", ") });
  }

  // Sanitize inputs
  req.body.name = sanitizeText(name);
  req.body.description = sanitizeText(description);

  next();
}

// Validation middleware for event submission
function validateEvent(req, res, next) {
  const { title, description, date, location, eventType, skillLevel } =
    req.body;

  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push("Event title must be at least 3 characters");
  }

  if (!date || !validator.isISO8601(date)) {
    errors.push("Please provide a valid event date");
  }

  if (!location || location.trim().length < 3) {
    errors.push("Event location must be at least 3 characters");
  }

  const validEventTypes = [
    "competition",
    "workshop",
    "meetup",
    "demo",
    "tournament",
    "skate-jam",
  ];
  if (!eventType || !validEventTypes.includes(eventType)) {
    errors.push("Invalid event type");
  }

  const validSkillLevels = ["all", "beginner", "intermediate", "advanced"];
  if (!skillLevel || !validSkillLevels.includes(skillLevel)) {
    errors.push("Invalid skill level");
  }

  if (description && description.length > 2000) {
    errors.push("Description must be less than 2000 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(", ") });
  }

  // Sanitize inputs
  req.body.title = sanitizeText(title);
  req.body.description = sanitizeText(description);
  req.body.location = sanitizeText(location);

  next();
}

module.exports = {
  validateEmail,
  validateUsername,
  validatePassword,
  validateLatitude,
  validateLongitude,
  sanitizeText,
  validateRegistration,
  validateSkateSpot,
  validateEvent,
};
