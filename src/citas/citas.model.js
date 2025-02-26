import { Schema, model } from "mongoose";

const AppointmentSchema = Schema(
  {
    adoptant: {
      name: {
        type: String,
        required: true, 
      },
      email: {
        type: String,
        required: true, 
        unique: true,
      },
      phone: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 8,
      },
      address: {
        type: String,
        required: true, 
      },
    },
    pet: {
      name: {
        type: String,
        required: true, 
      },
      species: {
        type: String,
        required: true, 
      },
      breed: {
        type: String,
        required: true, 
      },
    },
    appointmentDate: {
      type: Date,
      required: true, 
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AppointmentSchema.methods.toJSON = function () {
  const { __v, _id, ...appointment } = this.toObject();
  appointment.uid = _id;
  return appointment;
};

export default model('Appointment', AppointmentSchema);
