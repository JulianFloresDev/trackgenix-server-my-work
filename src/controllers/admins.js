import Admins from '../models/Admins';

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admins.find(); // Finds all admins in the database
    return res.status(200).json({
      message: 'Admins found',
      data: admins,
      error: false,
    });
  } catch (error) {
    return res.json({
      message: 'An error ocurred',
      data: undefined,
      error,
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const admin = new Admins({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    const result = await admin.save(); // Saves a new admin in the database
    return res.status(201).json({
      message: 'Admin created',
      data: result,
      error: false,
    });
  } catch (error) {
    return res.status(400).json({ // Should it be type 500?
      message: 'An error ocurred',
      data: undefined,
      error,
    });
  }
};

export default {
  getAllAdmins,
  createAdmin,
};
