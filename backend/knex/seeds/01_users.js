/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      userId: 1,
      userName: "Martin Balsam",
    },
    { userId: 2, userName: "John Fiedler" },
    { userId: 3, userName: "Lee J Cobb" },
    { userId: 4, userName: "E G Marshall" },
    { userId: 5, userName: "Jack Klugman" },
    { userId: 6, userName: "Edward Bins" },
    { userId: 7, userName: "Bridget Stacey" },
    {
      userId: 8,
      userName: "Henry Fonda",
      createdAt: new Date(Date.now()).toISOString(),
    },
    {
      userId: 9,
      userName: "Joseph Sweeney",
      createdAt: new Date(Date.now()).toISOString(),
    },
    { userId: 10, userName: "Ed Begley" },
    { userId: 11, userName: "George Voskovec" },
    { userId: 12, userName: "Robert Webber" },
  ]);
}
