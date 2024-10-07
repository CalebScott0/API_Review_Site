const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");
const { user_friend } = require("../db");

const prisma = new PrismaClient({
  log: ["info"],
});

let friendsArr = [];
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      "/Users/cbs062/Desktop/Review_Site_CSV_Files/user_friends.csv"
    )
    .pipe(parse({ from_line: 2 }));
  for await (const record of parser) {
    const user_id = record[0];
    const user_friends = record[1];
    friendsArr.push({
      user_id: user_id,
      friends: user_friends,
    });
  }
  console.log(friendsArr.length);
}
processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
