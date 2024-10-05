const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});

let count = 0;
let reviews = [];
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream("/Users/cbs062/Desktop/Review_Site_CSV_Files/review.csv")
    .pipe(parse({ from_line: 2 }));
  for await (const record of parser) {
    // first index in each array is the user_id that HAS a collection of friends
    // second index is a string of comma separated friend ids
    // const id = record[0];
    // const friends_array = [...record[1].split(",")];
    // TRY CREATING ONE BIG DATA OBJECT WITH EACH RECORD AND
    // THEN USE CREATE MANY?
    // AFTER TRYING WITH USER FRIENDS CSV FILE!

    // await prisma.user_friends.create({
    //   data: {
    //     user_id: id,
    //     friends: friends_array,
    //   },
    // });
    reviews.push({
      id: record[0],
      author_id: record[1],
      business_id: record[2],
      stars: +record[3],
      review_text: record[4],
      useful: +record[5],
      funny: +record[6],
      cool: +record[7],
      comment_count: +record[8],
      created_at: new Date(record[9]),
      updated_at: new Date(record[10]),
    });

    count++;
    if (count % 1000 === 0) {
      // 1987897 is total user count
      console.log(((count / 4208370) * 100).toFixed(2) + "%");
    }
  }
  let reviews_created = 1252360;
  reviews = reviews.slice(reviews_created);
  while (reviews.length) {
    const data = reviews.splice(0, 1000);

    reviews_created += data.length;

    console.log(`Creating ${data.length} Reviews`);
    console.time("Create");
    await prisma.review.createMany({ data });
    console.timeEnd("Create");
    console.log(
      `${reviews_created} Reviews Created / ${reviews.length} remaining`
    );
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
