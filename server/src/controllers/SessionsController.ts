// Node modules
import { Request, Response } from 'express';

// Local modules
import knex from '../database/connection';

class SessionsController {
    async register(req: Request, res: Response) {
        const { email, pass } = req.body;

        const id = await knex('users')
            .where('email', email)
            .andWhere('pass', pass)
            .select('id')
            .first();

        if (!id) {
            return res.json({ message: 'Invalid email or password' })
        }

        return res.json(id);
    }
}

export default SessionsController;