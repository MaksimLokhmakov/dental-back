const { validationResult } = require("express-validator");
const { Appointment, Patient } = require("../models");
const { groupBy, reduce } = require("lodash");
require("dayjs/locale/ru");
const dayjs = require("dayjs");

function AppointmentController() {}

const create = async function (req, res) {
  const errors = validationResult(req);

  const data = {
    patient: req.body.patient,
    dentNumber: req.body.dentNumber,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
    fullDate: req.body.fullDate,
    fullTime: req.body.fullTime,
  };

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      data: errors.array(),
    });
  }

  const patient = await Patient.findOne({ _id: data.patient });

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "PATIENT_NOT_FOUND",
    });
  }

  Appointment.create(data, function (err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        data: err,
      });
    }

    res.status(201).json({
      success: true,
    });
  });
};

const update = async function (req, res) {
  const appointmentId = req.params.id;
  const errors = validationResult(req);

  const data = {
    dentNumber: req.body.dentNumber,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
    fullDate: req.body.fullDate,
    fullTime: req.body.fullTime,
  };

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      data: errors.array(),
    });
  }
  Appointment.updateOne(
    { _id: appointmentId },
    { $set: data },
    function (err, doc) {
      if (err) {
        return res.status(500).json({
          success: false,
          data: err,
        });
      }
      if (!doc) {
        return res.status(404).json({
          success: false,
          message: "APPOINTMENT_NOT_FOUND",
        });
      }

      res.json({
        success: true,
      });
    }
  );
};

const remove = async function (req, res) {
  const id = req.params.id;

  const appointment = await Appointment.findOne({ _id: id });

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "APPOINTMENT_NOT_FOUND",
    });
  }

  Appointment.deleteOne({ _id: id }, (err) => {
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
  const reversKey = (key) => {
    let newKey = [];
    let temp = [];
    for (let i = 0; i < 2; i++) {
      temp = [...temp, key[i]];
    }
    newKey = [temp.join(""), ...newKey];
    temp = [];
    for (let i = 3; i < 5; i++) {
      temp = [...temp, key[i]];
    }
    newKey = [temp.join(""), ...newKey];
    temp = [];
    for (let i = 6; i < 10; i++) {
      temp = [...temp, key[i]];
    }
    newKey = [temp.join(""), ...newKey];

    return newKey;
  };

  const sortAppointmentsByTime = (data) => {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length - 1; j++) {
        let temp = {};
        if (
          Number(data[j].time.split(":").join("")) >
          Number(data[j + 1].time.split(":").join(""))
        ) {
          temp = data[j];
          data[j] = data[j + 1];
          data[j + 1] = temp;
        }
      }
    }

    return data;
  };

  const sortAppointmentsByDate = (data) => {
    let temp;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length - 1; j++) {
        if (
          Number(reversKey(data[j].date).join("")) >
          Number(reversKey(data[j + 1].date).join(""))
        ) {
          temp = data[j];
          data[j] = data[j + 1];
          data[j + 1] = temp;
        }
      }
    }
    return data;
  };

  Appointment.find({})
    .populate("patient")
    .exec(function (err, docs) {
      if (err) {
        return res.status(500).json({
          success: false,
          data: err,
        });
      }

      res.json({
        success: true,
        data: reduce(
          groupBy(sortAppointmentsByDate(docs), "date"),
          (result, value, key) => {
            result = [
              ...result,
              {
                title: dayjs(reversKey(key)).locale("ru").format("DD MMMM"),
                data: sortAppointmentsByTime(value),
              },
            ];

            return result;
          },
          []
        ),
      });
    });
};

AppointmentController.prototype = {
  all,
  create,
  remove,
  update,
};

module.exports = AppointmentController;
