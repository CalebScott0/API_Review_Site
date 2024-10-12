const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});
let complimentsArr = [];
let records;
let count = 0;
//
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      "/Users/cbs062/Desktop/Review_Site_CSV_Files/user_compliment.csv"
    )
    .pipe(parse({ from_line: 2 }));

  // compliment table has:
  // id - default uuid
  // user_id
  // enum type
  /* - COOL
   * - CUTE
   * - FUNNY
   * -  HOT
   * - LIST
   * - MORE
   * - NOTE
   * - PHOTOS
   * - PLAIN
   * - PROFILE
   * - WRITER
   */
  // count

  const ENUMS = [
    "COOL",
    "CUTE",
    "FUNNY",
    "HOT",
    "LIST",
    "MORE",
    "NOTE",
    "PHOTOS",
    "PLAIN",
    "PROFILE",
    "WRITER",
  ];

  const BATCH_SIZE = 1000;

  for await (const record of parser) {
    // complimentsArr.push(record);
    complimentsArr.push({
      id: record[0],
      user_id: record[1],
      type: record[2],
      count: +record[3],
    });
    if (complimentsArr.length === BATCH_SIZE) {
      try {
        await prisma.user_compliment.createMany({
          data: [...complimentsArr.splice(0, complimentsArr.length)],
          skipDuplicates: true,
        });
      } catch (error) {
        console.log(error);
      }
      console.log(`${(count += BATCH_SIZE)} records created`);
    }
  }
  return;
  // flatMap to return one array instead of array of nested arrays
  records = complimentsArr.flatMap((user) => {
    //user_id is the first index of each nested user array - rest of the indexes are counts of compliments
    const user_id = user[0];
    //   for each user, return a mapped array of objects
    //   each object will consist of {
    //      user_id
    //      enum type of compliment
    //      count of the compliment type received
    // }
    return ENUMS.map((type, i) => ({
      user_id,
      type,
      count: +user[i + 1],
    }));
  });
  // each nested array represents 1 user and their
  // received compliments

  const create_batch = [];
  console.log("Creating records...");
  for (let i = 0; i < records.length; i++) {
    create_batch.push(records[i]);

    if (create_batch.length === BATCH_SIZE) {
      try {
        await prisma.user_compliment.createMany({
          data: [...create_batch.splice(0, BATCH_SIZE)],
          skipDuplicates: true,
        });

        console.log(
          `${(count += BATCH_SIZE)} records created / ${records.length}`
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
  if (create_batch.length > 0) {
    try {
      await prisma.user_compliment.createMany({
        data: create_batch,
        skipDuplicates: true,
      });

      console.log(
        `${(count += create_batch.length)} records created / ${records.length}`
      );
    } catch (error) {
      console.log(error);
    }
  }
  console.log("Completed");
}

processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });
