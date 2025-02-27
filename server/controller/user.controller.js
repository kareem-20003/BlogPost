// Base
const userRepo = require('../model/user/user.repo');
const bcrypt = require('bcrypt');
const { generateToken, verifyAccount } = require('../utils/token.utils');
const Logger = require('../services/logger.services');
const userLogger = new Logger('user', 'user.controller');
const auditAction = require('../audit/audit.actions');
const { prepareAuditEvent } = require('../audit/audit.service');
const getCurrentDate = () => new Date(Date.now()).toUTCString();
// Methods

// GET Req Methods
let getAllUsers = async (req, res) => {
  let date = getCurrentDate();
  try {
    let users = await userRepo.list();
    userLogger.info('get all users', users.records);
    prepareAuditEvent(
      auditAction.GET_ALL_USERS,
      users.records,
      users.code,
      null,
      'user',
      date
    );
    res.status(users.code).json(users);
  } catch (err) {
    userLogger.error(err.message);
    prepareAuditEvent(auditAction.GET_ALL_USERS, null, 500, err, 'user', date);
    res.status(500).json({ message: err.message });
  }
};

let getUserById = async (req, res) => {
  try {
    let { id: _id } = req.params;
    let user = await userRepo.get({ _id });
    userLogger.info('get user', user.record);
    res.status(user.code).json(user);
  } catch (err) {
    userLogger.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

let getMe = async (req, res) => {
  try {
    let user = await userRepo.get({ _id: req.user._id });
    userLogger.info('get user', user.record);
    res.status(user.code).json(user);
  } catch (err) {
    userLogger.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// POST|PUT|Delete Req Methods
let register = async (req, res) => {
  let date = getCurrentDate();
  try {
    let { record: user } = await userRepo.create(req.body);

    userLogger.info('Account Created Successfully', user);
    prepareAuditEvent(auditAction.REGISTER, user, 201, null, user.role, date);
    res.status(201).json({ msg: 'registered' });
  } catch (err) {
    console.log('🚀 ~ register ~ err:', err);
    userLogger.error(err.message);
    prepareAuditEvent(auditAction.REGISTER, null, 500, err, 'user', date);
    res.status(500).json({ error: err.message });
  }
};

let deleteUser = async (req, res) => {
  try {
    let { id } = req.params;
    let deleted = await userRepo.remove(id);
    userLogger.info(`Account Deleted Successfully: ${id}`);
    res.status(deleted.code).json(deleted);
  } catch (err) {
    userLogger.error(err.message);
    res.status(501).json({ error: err.message });
  }
};

let updateUser = async (req, res) => {
  try {
    let { id } = req.params;
    let updated = await userRepo.update(id, { ...req.body });
    userLogger.info('account updated successfully', updated.record);
    res.status(updated.code).json(updated);
  } catch (err) {
    userLogger.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

let login = async (req, res) => {
  let date = getCurrentDate();
  try {
    let { email, password } = req.body;
    let { record: user, code, error } = await userRepo.get({ email });
    if (!user) throw new Error(error);
    if (user) {
      let match = await bcrypt.compare(password, user.password);
      if (!user.isActive)
        return res.status(403).json({ msg: "Email hasn't been Verified yet" });
      if (match) {
        const token = await generateToken({ user });
        userLogger.info('Account Verified Successfully', user);
        prepareAuditEvent(auditAction.LOGIN, user, 200, null, user.role, date);
        res
          .status(200)
          .json({ msg: 'account is confirmed successfully', token, user });
      } else res.status(401).json({ msg: 'incorrect password' });
    } else res.status(code).json(user);
  } catch (err) {
    console.log('🚀 ~ }elseres.status ~ err:', err);
    userLogger.error(err.message);
    prepareAuditEvent(auditAction.LOGIN, null, 500, err, 'user', date);
    res.status(500).json({ error: err.message });
  }
};

// Exports
module.exports = {
  register,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  getMe,
  login,
};
