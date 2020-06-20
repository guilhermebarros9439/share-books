import Knex from "knex";

// Create table and schema
export async function up(knex: Knex) {
    return knex.schema.createTable('books', table => {
        table.increments().primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
        table.string('description');
        table.boolean('isdonation').defaultTo(true).notNullable();
        table.integer('user_id').notNullable();
        table.foreign('user_id').references('id').inTable('users');
    });
}

// Drop table
export async function down(knex: Knex) {
    return knex.schema.dropTable('books');
}