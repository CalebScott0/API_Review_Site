const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient({
  log: ["info"],
});

let friendsArr = [];
let count = 0;
let set = new Set();

async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      "/Users/cbs062/Desktop/Review_Site_CSV_Files/user_friends.csv"
    )
    .pipe(parse({ from_line: 2 }));

  for await (const record of parser) {
    const user_id = record[0];

    const user_friends = record[1].split(", ");

    for (const friend_id of user_friends) {
      // add all unique user ids to the set
      // avoid millions of user find unique calls
      if (!set.has(user_id)) {
        const friend_exists = await prisma.user.findUnique({
          where: { id: friend_id },
        });

        if (!friend_exists) {
          continue;
          // Skip this friend if they don't exist
        } else {
          set.add(user_id);
          friendsArr.push({ user_id, friend_id });
        }
      }

      const BATCH_SIZE = 10;
      if (friendsArr.length === BATCH_SIZE) {
        try {
          await prisma.user_friend
            .createMany({
              data: [...friendsArr.splice(0, friendsArr.length)],
              skipDuplicates: true, // To avoid duplicates if the seeding is rerun
            })
            .then(() => (count += BATCH_SIZE))
            .then(() => console.log(`${count} friends created`));
        } catch (error) {
          console.error("Unable to create batch:", error);
        }
      }
    }
  }
  // remaining records
  if (friendsArr.length > 0) {
    try {
      await prisma.$transaction(async (prisma) => {
        await prisma.user_friend.createMany({
          data: friendsArr,
          skipDuplicates: true, // To avoid duplicates if the seeding is rerun
        });
      });

      console.log(`Inserted ${friendsArr.length} records`);
    } catch (error) {
      console.error("Unable to create batch:", error);
    }
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
