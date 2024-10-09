const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});

let friendsArr = [];
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
      const pair = `${user_id}-${friend_id}`;
      const friendExists = await prisma.user.findUnique({
        where: { id: friend_id },
      });
      if (!friendExists) {
        // console.error(`Friend with ID ${friend_id} does not exist.`);
        continue; // Skip this friend if they don't exist
      }
      if (!set.has(pair)) {
        set.add(pair);
        friendsArr.push({ user_id, friend_id });
      }
      if (friendsArr.length === 10000) {
        (async () => {
          try {
            await prisma.$transaction(async (prisma) => {
              await prisma.user_friend.createMany({
                data: friendsArr,
                skipDuplicates: true, // To avoid duplicates if the seeding is rerun
              });
            });
            console.log(`Inserted ${friendsArr.length} records :)`);
            friendsArr.length = 0;
            set.clear();
          } catch (error) {
            console.error("Unable to create batch:", error);
          }
        })();
      }
    }
    // - 2 USERS W/O FRIENDS ARE THE TEST USERS - delete
  }
  // remaining records
  if (friendsArr.length > 0) {
    (async () => {
      try {
        await prisma.$transaction(async (prisma) => {
          await prisma.user_friend.createMany({
            data: friendsArr,
            skipDuplicates: true, // To avoid duplicates if the seeding is rerun
          });
        });
        console.log(`Inserted ${friendsArr.length} records, done!`);
      } catch (error) {
        console.error("Unable to create batch:", error);
      }
    })();
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
