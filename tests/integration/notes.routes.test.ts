import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('GET /notes/:id', () => {
    it('responde 404 cuando la nota no existe', async () => {
        const app = makeApp(':memory:');
        const response = await request(app).get('/notes/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'NotFound' });
    });

    it('responde 200 con la nota solicitada', async () => {
        const app = makeApp(':memory:');
        const created = await request(app)
        .post('/notes')
        .send({ title: 'Primera', content: 'Contenido A' });

        expect(created.status).toBe(201);

        const response = await request(app).get(`/notes/${created.body.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(created.body);
    });
});

describe('PATCH /notes/:id', () => {
    it('responde 404 cuando la nota no existe', async () => {
        const app = makeApp(':memory:');
        const response = await request(app)
        .patch('/notes/999')
        .send({ title: 'Titulo nuevo' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'NotFound' });
    });

    it('responde 200 y conserva los campos no modificados', async () => {
        const app = makeApp(':memory:');
        const created = await request(app)
        .post('/notes')
        .send(
            { title: 'Original', content: 'Sin cambios', pinned: true }
        );

        expect(created.status).toBe(201);

        const response = await request(app)
        .patch(`/notes/${created.body.id}`)
        .send(
            { title: 'Nuevo' }
        );

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: created.body.id,
            title: 'Nuevo',
            content: 'Sin cambios',
            pinned: true,
            createdAt: created.body.createdAt
        });

        const persisted = await request(app).get(`/notes/${created.body.id}`);
        expect(persisted.status).toBe(200);
        expect(persisted.body).toEqual(response.body);
    });
});