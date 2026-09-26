import { describe,expect,it} from 'vitest';
import request  from 'supertest';
import { makeApp } from '../../src/app';

describe('GET /notes/:id',()=>{
    it('responde 404 cuando la nota no existe',async()=>{
        const app = makeApp(':memory:');
        const response=await request(app).get('/notes/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({error:'NotFound'});
    });
});