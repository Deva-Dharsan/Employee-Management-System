const express = require('express');
const router = express.Router();
const {
  getAllParentDept,
  createParentDept,
  getChildDeptByParentId,
  createChildDept,
} = require('../controllers/master.controller');

router.get('/GetParentDepartment', getAllParentDept);

router.post('/CreateParentDepartment', createParentDept);

router.get('/GetChildDepartmentByParentId', getChildDeptByParentId);

router.post('/CreateChildDepartment', createChildDept);

module.exports = router;