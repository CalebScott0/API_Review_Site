const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["info"],
});

(async () => {
  await prisma.$queryRaw`UPDATE business
                               set location = ST_SetSRID(ST_MakePoint(latitude, longitude), 4326)`;
  console.log(
    await prisma.$queryRaw`SELECT "name", latitude, longitude, ST_AsText("location") AS "location"
                              FROM business LIMIT 10;`
  );
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
