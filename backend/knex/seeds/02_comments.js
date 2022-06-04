/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("comments").del();
  await knex("comments").insert([
    {
      commentText:
        "Nine of us now seem to feel that the defendant is innocent, but we're just gambling on probabilities. \
        We may be wrong. We may be trying to return a guilty man to the community. No one can really know. \
        But we have a reasonable doubt, and this is a safeguard that has enormous value in our system. \
        No jury can declare a man guilty unless it's sure. We nine can't understand how you three are still so sure. \
        Maybe you can tell us.",
      userId: 8,
    },
    {
      commentText:
        "It takes a great deal of courage to stand alone even if you believe in something very strongly.",
      userId: 9,
    },
  ]);
}
