import Admins from '../models/Admins';

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admins.findById(id);
    return res.status(200).json({
      message: 'Admin Found',
      data: admin,
    });
  } catch (err) {
    return res.status(404)
      .json({
        message: `Something was wrong: ${err.message}`,
      });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admins.findByIdAndDelete(id);

    if (!admin) {
      throw new Error('ID doesnt match with a valid admin!');
    }
    return res.status(204).json();
  } catch (err) {
    return res.status(404)
      .json({
        message: `Something was wrong: ${err.message}`,
        error: true,
      });
  }
};

const editAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admins.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true },
    );
    if (!admin) {
      return res.status(404).json({
        message: `Admin with ${id} dont exist on DB.`,
        error: true,
      });
    }
    return res.status(200)
      .json({
        message: `Admin with id ${id} found and successfully edited!`,
        data: admin,
      });
  } catch (err) {
    return res.status(400)
      .json({
        message: `Something was wrong: ${err.message}`,
      });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admins.find(req.query);
    if (!admins.length) {
      return res.status(404).json({
        message: 'Admin not found',
      });
    }
    return res.status(200).json({
      message: 'Admins found',
      data: admins,
    });
  } catch (err) {
    return res.status(404).json({
      message: `An error ocurred: ${err}`,
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

    const result = await admin.save();
    return res.status(201).json({
      message: 'Admin created',
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      message: `An error ocurred: ${err}`,
    });
  }
};

export default {
  getAdminById,
  deleteAdmin,
  editAdmin,
  getAllAdmins,
  createAdmin,
};
