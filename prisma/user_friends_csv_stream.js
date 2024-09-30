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
    .createReadStream("./user_friends.csv")
    .pipe(parse({ from_line: 2 }));
  for await (const record of parser) {
    // first index in each array is the user_id that HAS a collection of friends
    // second index is a string of comma separated friend ids
    const id = record[0];
    const friends = [...record[1].split(",")];

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
        // 1987897 is total user count
      console.log(((count / 1987897) * 100).toFixed(2) + "%");
    }
  }
  console.log(
    await prisma.user.findMany({
      skip: 10,
      take: 1,
    })
  );
}
processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
