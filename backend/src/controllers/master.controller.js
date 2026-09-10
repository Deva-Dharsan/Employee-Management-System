const masterRepo = require('../repositories/master.repository');

const getAllParentDept = async (req, res) => {
  try {
    const data = await masterRepo.getAllParentDepts();
    return res.status(200).json({ result: true, message: 'Parent departments fetched successfully', data });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const getChildDeptByParentId = async (req, res) => {
  try {
    const data = await masterRepo.getChildDeptsByParent(req.query.deptId);
    return res.status(200).json({ result: true, message: 'Child departments fetched successfully', data });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const createParentDept = async (req, res) => {
  try {
    const newDept = await masterRepo.createParent(req.body);
    return res.status(201).json({ result: true, message: 'Parent department created successfully', data: newDept });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const createChildDept = async (req, res) => {
  try {
    const newChild = await masterRepo.createChild(req.body);
    return res.status(201).json({ result: true, message: 'Child department created successfully', data: newChild });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

module.exports = {
  getAllParentDept,
  getChildDeptByParentId,
  createParentDept,
  createChildDept,
};
