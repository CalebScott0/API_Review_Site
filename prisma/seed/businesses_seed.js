// ADD THIS AT BOTTOM OF SCRIPT
// await prisma.$queryraw`UPDATE businesses SET city = INITCAP(TRIM(REGEXP_REPLACE(city, '\s+', ' ', 'g'))) WHERE city IS NOT NULL;`;
