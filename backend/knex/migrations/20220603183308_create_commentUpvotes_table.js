/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("commentUpvotes", function (table) {
    table.increments();
    table.integer("commentId").references("comments.commentId");
    table.integer("userId").references("users.userId");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("commentUpvotes");
}
