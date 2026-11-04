import request from 'supertest';
import app from './app';

describe('API HTTP Endpoints (Punto de Control 1)', () => {
  describe('Books API (/books)', () => {
    it('GET /books should return 200 and list of books', async () => {
      const response = await request(app).get('/books');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('GET /books/:id should return 200 for existing book', async () => {
      const response = await request(app).get('/books/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Cien años de soledad');
    });

    it('GET /books/:id should return 404 for non-existing book', async () => {
      const response = await request(app).get('/books/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Libro no encontrado' });
    });

    it('POST /books should return 201 and created book', async () => {
      const newBook = {
        title: 'El Aleph',
        author: 'Jorge Luis Borges',
        isbn: '9789875666481',
        copies: 5,
      };

      const response = await request(app).post('/books').send(newBook);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newBook.title);
      expect(response.body.isbn).toBe(newBook.isbn);
    });

    it('POST /books with invalid data should return 400 and validation message', async () => {
      const invalidBook = {
        title: '',
        author: 'Autor',
        isbn: '123',
        copies: -2,
      };

      const response = await request(app).post('/books').send(invalidBook);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('PATCH /books/:id/borrow should decrement copies and return 200', async () => {
      const response = await request(app).patch('/books/1/borrow');
      expect(response.status).toBe(200);
      expect(response.body.copies).toBe(2);
    });
  });

  describe('Members API (/members)', () => {
    it('GET /members should return 200 and list of members', async () => {
      const response = await request(app).get('/members');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('GET /members/:id should return 200 for existing member', async () => {
      const response = await request(app).get('/members/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Lucía Mendoza');
    });

    it('GET /members/:id should return 404 for non-existing member', async () => {
      const response = await request(app).get('/members/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Socio no encontrado' });
    });

    it('POST /members should return 201 and created member', async () => {
      const newMember = {
        name: 'Andrés Paredes',
        email: 'andres.paredes@correo.com',
        membershipType: 'externo',
      };

      const response = await request(app).post('/members').send(newMember);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newMember.name);
      expect(response.body.active).toBe(true);
    });

    it('POST /members with invalid email should return 400', async () => {
      const invalidMember = {
        name: 'Andrés',
        email: 'formato-invalido',
        membershipType: 'docente',
      };

      const response = await request(app).post('/members').send(invalidMember);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'El correo no tiene un formato válido' });
    });

    it('PATCH /members/:id/deactivate should return 200 and active=false', async () => {
      const response = await request(app).patch('/members/1/deactivate');
      expect(response.status).toBe(200);
      expect(response.body.active).toBe(false);
    });
  });
});
