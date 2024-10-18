const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["info"],
});

(async () => {
  // create postgis extension, add location column to business table with geometry type and create a GIST index for location
  await prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS postgis`;
  await prisma.$queryRaw`  ALTER TABLE business ADD COLUMN location geometry(Point, 4326);`;
  await prisma.$queryRaw`  CREATE INDEX idx_business_location ON business USING GIST (location);`;

  // update business location field by creating geo point with latitude and longitude of each business
  // LONGITUDE FIRST in coordinates
  await prisma.$queryRaw`UPDATE business
                               set location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)`;
  console.log(
    await prisma.$queryRaw`SELECT "name", longitude, latitude, ST_AsText("location") AS "location"
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
