const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = require('../server');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

describe('Auth Routes', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
  });

  it('should register a patient and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register/patient')
      .send({
        name: 'Test Patient',
        email: 'test@patient.com',
        password: '123456',
        phone: '1234567890',
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('should register a doctor and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register/doctor')
      .send({
        name: 'Test Doctor',
        email: 'test@doctor.com',
        password: '123456',
        specialty: 'Cardiology',
        phone: '1234567890',
        availableTimes: ['9:00 AM', '10:00 AM'],
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('should login a patient and return a token', async () => {
    const patient = new Patient({
      name: 'Test Patient',
      email: 'test@patient.com',
      password: await bcrypt.hash('123456', 10),
      phone: '1234567890',
    });

    await patient.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@patient.com',
        password: '123456',
        role: 'patient',
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });
});
