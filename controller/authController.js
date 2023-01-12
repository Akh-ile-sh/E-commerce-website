const User = require("../models/User");
const StatusCodes = require("http-status-codes");
const customErrors = require("../errors");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreayExists = await User.findOne({ email });

  if (emailAlreayExists) {
    throw new customErrors.BadRequestError("Email already exists");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  res.status(StatusCodes.CREATED).json({ user });
};
const login = async (req, res) => {
  res.send("login user");
};
const logout = async (req, res) => {
  res.send("logout user");
};

module.exports = { register, login, logout };
