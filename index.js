const express = require("express");
const cors = require("cors");

const db = require("./core/db");
const {
  patientValidation,
  appointmentValidation,
} = require("./utils/validations"); // * ПРОВЕРКА
const { PatientCtrl, AppointmentCtrl } = require("./controllers");

// TODO: Сделать push-уведомления для стомотолога приеме.
// TODO: Сделать добавление 0 к датам от 1 числа до 9
// TODO: Сделать запрос на удаление всех приемов при удалении пациента

const app = express();
app.use(express.json()); // * JSON формат данных
app.use(cors());

app.get("/patients", PatientCtrl.all);
app.post("/patients", patientValidation.create, PatientCtrl.create);
app.delete("/patients/:id", PatientCtrl.remove);
app.patch("/patients/:id", patientValidation.create, PatientCtrl.update);
app.get("/patients/:id", PatientCtrl.show);

app.get("/appointments", AppointmentCtrl.all);
app.post("/appointments", appointmentValidation.create, AppointmentCtrl.create);
app.delete("/appointments/:id", AppointmentCtrl.remove);
app.patch(
  "/appointments/:id",
  appointmentValidation.update,
  AppointmentCtrl.update
);

app.listen(6666, function (err) {
  if (err) {
    return console.log("error");
  }

  console.log("Server started");
});
