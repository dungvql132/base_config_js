const Joi = require('joi');

// Quy tắc validate cho employees
const employeeSchema = Joi.object().keys({
  employeenumber: Joi.number().positive(),
  firstname: Joi.string().min(3).max(50).required(),
  lastname: Joi.string().min(3).max(50).required(),
  extension: Joi.string().max(50).required(),
  email: Joi.string().email().min(10).max(100).required(),
  officecode: Joi.string().max(10).required(),
  reportto: Joi.number().positive().allow(null),
  jobtitle: Joi.string().valid('president', 'manager', 'leader').required(),
});

// Quy tắc validate cho customers
const customerSchema = Joi.object().keys({
  customernumber: Joi.number().positive(),
  customername: Joi.string().min(5).max(50).required(),
  contactlastname: Joi.string().min(3).max(50).required(),
  contactfirstname: Joi.string().min(3).max(50).required(),
  phone: Joi.string().min(8).max(20).required(),
  addressline1: Joi.string().min(10).max(50).required(),
  addressline2: Joi.string().min(10).max(50).allow(null),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).allow(null),
  postalcode: Joi.string().min(5).max(15).allow(null),
  country: Joi.string().min(2).max(50).required(),
  salesrepemployeenumber: Joi.number().positive().allow(null),
  creditlimit: Joi.number().precision(2).allow(null),
});




// Quy tắc validate cho users/register
const userRegisterSchema = Joi.object().keys({
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(6).max(100).regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/).required(),
  employeenumber: Joi.number().positive().required(),
});

const validateSchema = {
    'users':{
        'post':userRegisterSchema,
        'put':userRegisterSchema
    },
    'employees':{
        'post':employeeSchema,
        'put':employeeSchema
    },
    'customers':{
        'post':customerSchema,
        'put':customerSchema
    },
}

module.exports = validateSchema