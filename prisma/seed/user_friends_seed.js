const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});
let friends_array = [];
let count = 0;
//
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      "/Users/cbs062/Desktop/Review_Site_CSV_Files/user_friends.csv"
    )
    .pipe(parse({ from_line: 2 }));

  for await (const record of parser) {
    const user_id = record[0];
    console.log(`${++count} records parsed`);

    const user_friends = record[1].split(", ");

    // TRY WITH A MAP?
    for (const friend_id of user_friends) {
      // if (!set.has(friend_id)) {
      const friend_exists = await prisma.users.findUnique({
        where: { id: friend_id },
      });
      // }

      if (!friend_exists) {
        continue;
        // Skip this friend if they don't exist
      } else {
        // set.add(friend_id);
        friends_array.push({
          user_id,
          friend_id,
        });
      }
    }
    let create_count = 0;
    const total = friends_array.length;
    const BATCH_SIZE = 10000;
    if (friends_array.length === BATCH_SIZE) {
      try {
        await prisma.user_friends
          .createMany({
            data: [...friends_array.splice(0, friends_array.length)],
            skipDuplicates: true, // To avoid duplicates if the seeding is rerun
          })
          .then(() => (create_count += BATCH_SIZE))
          .then(() =>
            console.log(`${create_count} friends created / ${total}`)
          );
      } catch (error) {
        console.error("Unable to create batch:", error);
      }
    }
  }
  // }
  // remaining records
  if (friends_array.length > 0) {
    try {
      await prisma.user_friends.createMany({
        data: friends_array,
        skipDuplicates: true, // To avoid duplicates if the seeding is rerun
      });

      console.log(`Inserted ${friends_array.length} records`);
    } catch (error) {
      console.error("Unable to create batch:", error);
    }

    console.log("Complete");
  }
}

processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });
