const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});
const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function isValidTime(timeStr) {
  const timePattern = /^([0-1]?\d|2[0-3]):[0-5]\d$/; // Matches h:mm and hh:mm formats
  return timePattern.test(timeStr);
}
function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(":");
  const formattedHour = hour.padStart(2, "0"); // Ensures the hour has at least 2 digits
  return `${formattedHour}:${minute}`;
}
let count = 0;
const records = [];
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      "/Users/cbs062/Desktop/Review_Site_CSV_Files/business_hours.csv"
    )
    .pipe(parse({ from_line: 2 }));
  console.log("Parsing records...");
  for await (const record of parser) {
    const business_id = record[0];
    const hours = record.slice(1);

    // go through each day of the week
    // monday - sunday = index 0-6 of hours
    days.forEach((day, idx) => {
      // split each hour record into open/close time
      let [open_time, close_time] = hours[idx].split("-");

      if (isValidTime(open_time) && isValidTime(close_time)) {
        open_time = formatTime(open_time);
        close_time = formatTime(close_time);

        records.push({
          business_id,
          day_of_week: day,
          open_time: new Date(`1970-01-01T${open_time}:00Z`),
          close_time: new Date(`1970-01-01T${close_time}:00Z`),
        });
      }
    });
  }
  console.log("creating records");
  const total = records.length;

  while (records.length) {
    const batch = records.splice(0, 1000);
    (async () => {
      try {
        await prisma.business_hours.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } catch (error) {
        console.log(error);
      }
    })()
      .then(() => (count += batch.length))
      .then(() =>
        console.log(`${count} business hour records created / ${total}`)
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
