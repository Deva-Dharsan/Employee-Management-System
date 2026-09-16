require('dotenv').config();
const express          = require('express');
const cors             = require('cors');
const path             = require('path');
const connectDB        = require('./config/db');
const employeeRoutes   = require('./routes/employee.routes');
const masterRoutes     = require('./routes/master.routes');
const projectRoutes    = require('./routes/project.routes');
const assignmentRoutes = require('./routes/assignment.routes');

const app = express();

connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/EmployeeManagement', employeeRoutes);
app.use('/api/EmployeeManagement', masterRoutes);
app.use('/api/EmployeeManagement', projectRoutes);
app.use('/api/EmployeeManagement', assignmentRoutes);

const angularDist = path.join(__dirname, '../../frontend/dist/employee_22/browser');
app.use(express.static(angularDist));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(angularDist, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ result: false, message: err.message, data: null });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});