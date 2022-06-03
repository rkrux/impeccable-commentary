/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("commentUpvotes").del();
  await knex("commentUpvotes").insert([
    { commentId: 1, userId: 1 },
    { commentId: 1, userId: 2 },
    { commentId: 1, userId: 3 },
    { commentId: 1, userId: 4 },
    { commentId: 2, userId: 5 },
    { commentId: 2, userId: 6 },
    { commentId: 2, userId: 7 },
  ]);
}
