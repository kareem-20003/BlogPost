// Base
const app = require('express').Router();
let userController = require('../../controller/user.controller');
let validator = require('../../helpers/common.validate');
let {
  confirmPasswordValition,
  addUserValidation,
  updateUserValidation,
} = require('../../validation/user.validation');

// Authentication Base
const { verifyToken } = require('../../utils/token.utils');

// GET Req Routes

app.get('/getAllUsers', verifyToken(), userController.getAllUsers);
app.get('/', verifyToken(), userController.getAllUsers);
app.get('/getUserById/:id', verifyToken(), userController.getUserById);
app.get('/me', verifyToken(), userController.getMe);

app.post('/register', validator(addUserValidation), userController.register);
app.post('/login', validator(confirmPasswordValition), userController.login);

app.put(
  '/updateUser/:id',
  [verifyToken(), validator(updateUserValidation)],
  userController.updateUser
);
app.delete('/deleteUser/:id', verifyToken(), userController.deleteUser);

module.exports = app;
