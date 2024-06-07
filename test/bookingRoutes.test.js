const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = require('../server');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Booking Routes', () => {
  let patientToken, doctorToken, patientId, doctorId;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const patient = new Patient({
      name: 'Test Patient',
      email: 'test@patient.com',
      password: await bcrypt.hash('123456', 10),
      phone: '1234567890',
    });
    await patient.save();

    patientId = patient._id;
    patientToken = jwt.sign({ id: patientId, role: 'patient' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const doctor = new Doctor({
      name: 'Test Doctor',
      email: 'test@doctor.com',
      password: await bcrypt.hash('123456', 10),
      specialty: 'Cardiology',
      phone: '1234567890',
      availableTimes: ['9:00 AM', '10:00 AM'],
    });
    await doctor.save();

    doctorId = doctor._id;
    doctorToken = jwt.sign({ id: doctorId, role: 'doctor' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Appointment.deleteMany({});
  });

  it('should book an appointment', async () => {
    const res = await request(app)
      .post('/api/patient/book')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId,
        date: '2024-06-15',
        time: '9:00 AM',
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('appointment');
  });

  it('should get patient appointments', async () => {
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date: '2024-06-15',
      time: '9:00 AM',
      status: 'Pending',
    });
    await appointment.save();

    const res = await request(app)
      .get('/api/patient/appointments')
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('appointments');
    expect(res.body.appointments).to.be.an('array');
  });

  it('should get doctor appointments', async () => {
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date: '2024-06-15',
      time: '9:00 AM',
      status: 'Pending',
    });
    await appointment.save();

    const res = await request(app)
      .get('/api/doctor/appointments')
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('appointments');
    expect(res.body.appointments).to.be.an('array');
  });
});
