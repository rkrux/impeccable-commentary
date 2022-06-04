/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      userName: "Martin Balsam",
    },
    { userName: "John Fiedler" },
    { userName: "Lee J Cobb" },
    { userName: "E G Marshall" },
    { userName: "Jack Klugman" },
    { userName: "Edward Bins" },
    { userName: "Bridget Stacey" },
    {
      userName: "Henry Fonda",
      createdAt: new Date(Date.now()).toISOString(),
    },
    {
      userName: "Joseph Sweeney",
      createdAt: new Date(Date.now()).toISOString(),
    },
    { userName: "Ed Begley" },
    { userName: "George Voskovec" },
    { userName: "Robert Webber" },
  ]);
}
