const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});

let count = 0;
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream("./user_friends_exported.csv")
    .pipe(parse({ from_line: 2 }));
  for await (const record of parser) {
    // first index in each array is the user_id that HAS a collection of friends
    const id = record[0];
    const friends = [...record.slice(1)];
    // REMBEMBER FIRST INDEX IN ARRAY IS THE USER
    // the rest of the records in the array is friends of the user
    // console.log([...record.slice(1)]);
    // console.log("user", user);
    // return;
    // for putting into prisma friends scalar list on users, (or make as separate table?)
    // splice out first record to find user and push all remaining records to friends list

    await prisma.user.update({
      where: { id },
      data: {
        friends: {
          push: friends,
        },
      },
    });

    count++;
    if (count % 1000 === 0) {
      console.log(count);
    }
  }
  console.log(await prisma.user.findFirst());
}
processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
