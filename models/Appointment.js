const mongoose = require("mongoose");
const { Schema } = mongoose;

const AppointmentSchema = new Schema(
  {
    dentNumber: Number,
    diagnosis: String,
    price: Number,
    date: String,
    time: String,
    fullDate: Date,
    fullTime: Date,
    patient: { type: Schema.Types.ObjectId, ref: "Patient" },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
