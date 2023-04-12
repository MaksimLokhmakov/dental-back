const { validationResult } = require("express-validator");
const { Patient } = require("../models");

function PatientController() {}

const create = function (req, res) {
  const data = {
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      data: errors.array(),
    });
  }

  Patient.create(data, function (err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        data: err,
      });
    }

    res.status(201).json({
      success: true,
      data: doc,
    });
  });
};

const update = async function (req, res) {
  console.log("req.params: ", req.params);
  console.log("req.body: ", req.body);
  const patientId = req.params.id;
  const errors = validationResult(req);

  const data = {
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
  };

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      data: errors.array(),
    });
  }
  Patient.updateOne({ _id: patientId }, { $set: data }, function (err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        data: err,
      });
    }
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "PATIENT_NOT_FOUND",
      });
    }

    res.json({
      success: true,
    });
  });
};

const remove = async function (req, res) {
  const id = req.params.id;

  const patient = await Patient.findOne({ _id: id });

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "PATIENT_NOT_FOUND",
    });
  }

  Patient.deleteOne({ _id: id }, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        data: err,
      });
    }
    res.json({
      status: "succes",
    });
  });
};

const all = function (req, res) {
  Patient.find({}, function (err, docs) {
    if (err) {
      return res.status(500).json({
        success: false,
        data: err,
      });
    }

    res.json({
      success: true,
      data: docs,
    });
  });
};

const show = async function (req, res) {
  const id = req.params.id;
  try {
    const patient = await Patient.findById(id).populate("appointments").exec();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "PATIENT_NOT_FOUND",
      });
    }

    res.json({
      status: "succes",
      data: { ...patient._doc, appointments: patient.appointments },
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: "PATIENT_NOT_FOUND",
    });
  }
};

PatientController.prototype = {
  all,
  create,
  update,
  remove,
  show,
};

module.exports = PatientController;
