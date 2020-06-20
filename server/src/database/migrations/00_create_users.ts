import Knex from "knex";

// Create table and schema
export async function up(knex: Knex) {
    return knex.schema.createTable('users', table => {
        table.increments().primary();
        table.string('avatar').notNullable();
        table.string('name').notNullable();
        table.string('lastname').notNullable();
        table.string('email').notNullable();
        table.string('pass').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
    });
}

// Drop table
export async function down(knex: Knex) {
    return knex.schema.dropTable('users');
}