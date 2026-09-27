import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('DELETE /notes/:id (Ejercicio 5)', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('elimina una nota y responde 204', async () => {
    const createRes = await request(app)
      .post('/notes')
      .send({ title: 'Para borrar', content: 'Contenido' });

    const id = createRes.body.id;

    const deleteRes = await request(app).delete(`/notes/${id}`);

    expect(deleteRes.status).toBe(204);
  });

  it('la nota eliminada ya no se puede obtener (404)', async () => {
    const createRes = await request(app)
      .post('/notes')
      .send({ title: 'Para borrar', content: 'Contenido' });

    const id = createRes.body.id;
    await request(app).delete(`/notes/${id}`);

    const getRes = await request(app).get(`/notes/${id}`);

    expect(getRes.status).toBe(404);
  });

  it('devuelve 404 si el id no existe', async () => {
    const res = await request(app).delete('/notes/99999');
    expect(res.status).toBe(404);
  });
});