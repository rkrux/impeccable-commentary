/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable('comments', function (table) {
    table
      .integer('parentCommentId')
      .nullable()
      .references('comments.commentId');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('comments', function (table) {
    table.dropColumn('parentCommentId');
  });
}
