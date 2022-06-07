/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('comments', function (table) {
    table.increments('commentId');
    table.string('commentText', 1000).notNullable();
    table.integer('userId').references('users.userId');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('comments');
}
