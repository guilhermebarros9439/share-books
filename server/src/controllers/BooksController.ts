// Node modules
import { Request, Response } from 'express';

// Local modules
import knex from '../database/connection';

// Book behaviours
class BooksController {
    // List books
    async index(req: Request, res: Response) {
        const books = await knex('books').select('*');

        return res.json(books);
    }

    // Create book
    async register(req: Request, res: Response) {
        const { title, description, isdonation } = req.body;

        const user_id = req.headers.authorization;

        const book = {
            image: 'book.png',
            title,
            description,
            isdonation,
            user_id
        };

        await knex('books').insert(book);

        return res.json(book);
    }

    // Update book
    async update(req: Request, res: Response) {
        const { title, description, isdonation } = req.body;
        const { id } = req.params;

        const user_id = req.headers.authorization;

        await knex('books')
            .where('user_id', Number(user_id))
            .andWhere('id', id)
            .update({
                title,
                description,
                isdonation
            });

        return res.json({ message: 'success!' });
    }

    // Delete book
    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const user_id = req.headers.authorization;

        await knex('books')
            .where('user_id', Number(user_id))
            .andWhere('id', id)
            .delete();

        return res.json({ message: 'success!' });
    }
}

export default BooksController;