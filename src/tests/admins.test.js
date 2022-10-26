import request from 'supertest';
import app from '../app';
import Admin from '../models/Admins';
import adminSeed from '../seeds/admins';

beforeAll(async () => {
  await Admin.collection.insertMany(adminSeed);
});

const correctAdminMock = {
  name: 'Carlitos',
  lastName: 'elBala',
  email: 'calibala@piñonfijo.com',
  password: 'chuchugua1',
};

const incorrectAdminMock = {
  name: '1234 Number Not Allowed',
  lastName: '!"$&"$#"  !$!af123r13',
  email: '----',
  password: 'AmAzInG-password-123',
};

const callCorrectGETRequest = () => request(app)
  .get('/api/admins/63533d49fc13ae16b7000000').send();
const callIncorrectGETRequest = () => request(app)
  .get('/api/admins/6666f4ea6dbs8655a34a45f1').send();
const callCorrectPUTRequest = () => request(app)
  .put('/api/admins/63533d49fc13ae16b7000000').send(correctAdminMock);
const callIncorrectPUTRequest = () => request(app)
  .put('/api/admins/63533d49fc13ae16b7000000').send(incorrectAdminMock);

describe('GET by id:', () => {
  describe('Success GET /api/admins/:id', () => {
    test('when send a VALID id it should send a 200 status code', async () => {
      const response = await callCorrectGETRequest();
      expect(response.status).toBe(200);
    });
    test('if send a VALID id it must have a body message equal to "Admin Found"', async () => {
      const response = await callCorrectGETRequest();
      expect(response.body.message).toBe('Admin Found');
    });
    test('if send a VALID id it must have a body data property of "name"', async () => {
      const response = await callCorrectGETRequest();
      expect(response.body.data).toHaveProperty('name');
    });
    test('if send a VALID id it must have a body data property of "lastName"', async () => {
      const response = await callCorrectGETRequest();
      expect(response.body.data).toHaveProperty('lastName');
    });
    test('if send a VALID id it must have a body data property of "email"', async () => {
      const response = await callCorrectGETRequest();
      expect(response.body.data).toHaveProperty('email');
    });
    test('if send a VALID id it must have a body data property of "password"', async () => {
      const response = await callCorrectGETRequest();
      expect(response.body.data).toHaveProperty('password');
    });
  });
  describe('Incorrect GET /api/admins/:id', () => {
    test('when send an INVALID id it should send a 404 status code', async () => {
      const response = await callIncorrectGETRequest();
      expect(response.status).toBe(404);
    });
    test('if send an INVALID id it must to have body message property', async () => {
      const response = await callIncorrectGETRequest();
      expect(response.body).toHaveProperty('message');
    });
  });
});

describe('PUT:', () => {
  describe('Success EDIT /api/admins/:id', () => {
    test('if send a VALID id with valid data on body it should have a 200 status code', async () => {
      const response = await callCorrectPUTRequest();
      expect(response.status).toBe(200);
    });
    test('if send a VALID id it must have a "message" property on body', async () => {
      const response = await callCorrectPUTRequest();
      expect(response.body).toHaveProperty('message');
    });
    test('if send a VALID id it must have a "data" property on body', async () => {
      const response = await callCorrectPUTRequest();
      expect(response.body).toHaveProperty('data');
    });
    test('', async () => {});
  });
  describe('Incorrect EDIT /api/admins/:id', () => {
    test('if send an INVALID id it must to return a 404 status code', async () => {
      const response = await request(app).put('/api/admins/63533d49fc13ae16b7000099').send(correctAdminMock);
      expect(response.status).toBe(404);
    });
    test('if send a VALID id with an INVALID body, it must to return 406 status code', async () => {
      const response = await callIncorrectPUTRequest();
      expect(response.status).toBe(406);
    });
    test('if send a VALID id with an INVALID body, it must have a "message" property on body', async () => {
      const response = await callIncorrectPUTRequest();
      expect(response.body).toHaveProperty('message');
    });
  });
});

describe('DELETE:', () => {
  describe('Success DEL /api/admins/:id tests:', () => {
    test('if send a VALID ID it should return status code 204.', async () => {
      const response = await request(app).del('/api/admins/63533d49fc13ae16b7000000').send();
      expect(response.status).toBe(204);
    });
  });
  describe('Incorrect DEL /api/admins/:id tests:', () => {
    test('if send an INVALID ID it should return status code 404.', async () => {
      const response = await request(app).del('/api/admins/63533d49fc13ae16b7000099').send();
      expect(response.status).toBe(404);
    });
    test('if send an INVALID ID it should return error message on body.', async () => {
      const response = await request(app).del('/api/admins/63533d49fc13ae16b7000099').send();
      expect(response.body.message).toBe('Something was wrong: ID doesnt match with a valid admin!');
    });
    test('if send an INVALID ID it should return true error property on body.', async () => {
      const response = await request(app).del('/api/admins/63533d49fc13ae16b7000099').send();
      expect(response.body.error).toBeTruthy();
    });
  });
});
