import mongoose from 'mongoose';
import Projects from '../models/Projects';

const { ObjectId } = mongoose.Types;

const isValidObjectId = (id) => ObjectId.isValid(id) && (String)(new ObjectId(id)) === id;

const getAllProjects = async (req, res) => {
  try {
    const projects = await Projects.find(req.query).populate({
      path: 'employees',
      populate: {
        path: 'employee',
        options: { withDeleted: true },
      },
    });

    return res.status(200).json({
      message: 'Projects list',
      data: projects,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error ${err}`,
      error: true,
    });
  }
};

const getAllWithDeletedProjects = async (req, res) => {
  try {
    const projects = await Projects.findWithDeleted(req.query).populate({
      path: 'employees',
      populate: {
        path: 'employee',
        options: { withDeleted: true },
      },
    });

    return res.status(200).json({
      message: 'Projects list',
      data: projects,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error ${err}`,
      error: true,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const project = await Projects.findById(id).populate({
      path: 'employees',
      populate: {
        path: 'employee',
        options: { withDeleted: true },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: `Project with id ${id} not found`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'Project found',
      data: project,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error ${err}`,
      error: true,
    });
  }
};

const getProjectsByEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const projects = await Projects.find({ 'employees.employee': id })
      .populate({
        path: 'employees',
        populate: {
          path: 'employee',
          options: { withDeleted: true },
        },
      });

    return res.status(200).json({
      message: 'Projects found',
      data: projects,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error ${err}`,
      error: true,
    });
  }
};

const createProject = async (req, res) => {
  try {
    const project = new Projects({
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      clientName: req.body.clientName,
      employees: req.body.employees,
    });
    const result = await project.save();
    return res.status(201).json({
      message: 'Project created successfully',
      data: result,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error ${err}`,
      error: true,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const projectToUpdate = await Projects.findByIdAndUpdate(
      id,
      req.body,
      { new: true },
    );
    if (!projectToUpdate) {
      return res.status(404).json({
        message: `Project with id:${id} not found`,
        error: true,
      });
    }
    return res.status(201).json({
      message: `Project with id ${id} updated successfully`,
      data: projectToUpdate,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error ${err}`,
      error: true,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const project = await Projects.deleteById(id);
    if (!project) {
      return res.status(404).json({
        message: `Project with id ${id} not found`,
        data: undefined,
        error: true,
      });
    }
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({
      message: `Server Error ${err}`,
      error: true,
    });
  }
};

export default {
  getAllProjects,
  getAllWithDeletedProjects,
  getProjectById,
  getProjectsByEmployee,
  createProject,
  updateProject,
  deleteProject,
};
