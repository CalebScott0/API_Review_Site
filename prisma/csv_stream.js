const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});

let errorCount = 0;
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      "/Users/cbs062/Desktop/Review_Site_CSV_Files/user_friends.csv"
    )
    .pipe(parse({ from_line: 2 }));
  for await (const record of parser) {
    const user_id = record[0];
    const friends = record[1].split(",");
    for (const friend_id of friends) {
      try {
        // TRY THIS WITH CREATE MANY!! or use gigasheet to break apart
        //  friends!!
        await prisma.user_friend.create({
          data: {
            user_id,
            friend_id,
          },
        });
      } catch (error) {
        console.log(error);
        errorCount++;
      }
    }
  }
  console.log(errorCount);
}
processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
