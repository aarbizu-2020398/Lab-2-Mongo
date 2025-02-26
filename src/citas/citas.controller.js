import Appointment from "./appointment.model.js";/ Asumiendo que tienes un modelo de cita/
import { response } from "express";


export const SaveAppointment = async (req, res = response) => {
  try {
    const { adoptant, pet, appointmentDate } = req.body;

    
    const newAppointment = new Appointment({
      adoptant,
      pet,
      appointmentDate,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Cita creada correctamente",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la cita",
      error,
    });
  }
}

export const getAppointments = async (req, res = response) => {
  try {
    const appointments = await Appointment.find();

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las citas",
      error,
    });
  }
}

export const searchAppointment = async (req, res = response) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar la cita",
      error,
    });
  }
}


export const deleteAppointment = async (req, res = response) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cita eliminada correctamente",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la cita",
      error,
    });
  }
}


