const chai = require('chai');
const sinon = require('sinon');
const { registerPatient, registerDoctor, login } = require('../controllers/authController');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

describe('Auth Controller', () => {
  describe('registerPatient', () => {
    it('should create a new patient and return a token', async () => {
      const req = {
        body: {
          name: 'Test Patient',
          email: 'test@patient.com',
          password: '123456',
          phone: '1234567890',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Patient.prototype, 'save').resolves();
      sinon.stub(jwt, 'sign').returns('fakeToken');

      await registerPatient(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ token: 'fakeToken' })).to.be.true;

      Patient.prototype.save.restore();
      jwt.sign.restore();
    });
  });

  describe('registerDoctor', () => {
    it('should create a new doctor and return a token', async () => {
      const req = {
        body: {
          name: 'Test Doctor',
          email: 'test@doctor.com',
          password: '123456',
          specialty: 'Cardiology',
          phone: '1234567890',
          availableTimes: ['9:00 AM', '10:00 AM'],
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Doctor.prototype, 'save').resolves();
      sinon.stub(jwt, 'sign').returns('fakeToken');

      await registerDoctor(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ token: 'fakeToken' })).to.be.true;

      Doctor.prototype.save.restore();
      jwt.sign.restore();
    });
  });

  describe('login', () => {
    it('should return a token for a valid patient', async () => {
      const req = {
        body: {
          email: 'test@patient.com',
          password: '123456',
          role: 'patient',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const patient = new Patient({
        email: 'test@patient.com',
        password: await bcrypt.hash('123456', 10),
      });

      sinon.stub(Patient, 'findOne').resolves(patient);
      sinon.stub(jwt, 'sign').returns('fakeToken');

      await login(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ token: 'fakeToken' })).to.be.true;

      Patient.findOne.restore();
      jwt.sign.restore();
    });
  });
});
