// DONT ROUND TO HALF, LEAVE AS FULL AVERAGE FIXED TO 2 DECIMALS
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["info"],
});

const BATCH_SIZE = 10000;
(async function () {
  // gorup by user_id in user friends table and count all occurrences to find total friends for each user
  const users_with_friends = await prisma.user_friends.groupBy({
    by: ["user_id"],
    _count: {
      _all: true,
    },
  });
  for (let i = 0; i < users_with_friends.length; i += BATCH_SIZE) {
    const update_batch = users_with_friends
      .slice(i, i + BATCH_SIZE)
      //  create array of promises
      .map(
        (user) =>
          prisma.$queryRaw`UPDATE users SET friend_count = ${user._count._all}
                          WHERE id = ${user.user_id}`
      );
    await Promise.all(update_batch);

    console.log(
      `Updated users # ${i + BATCH_SIZE} / ${users_with_friends.length} - ${(
        ((i + BATCH_SIZE) / users_with_friends.length) *
        100
      ).toFixed(2)}%...`
    );
  }
  return;
  const users = await prisma.users.findMany({
    select: {
      id: true,
    },
  });

  console.log(
    `Updating ${users.length} users with review count and average stars...`
  );
  // group reviews by author_id average on stars and total count
  const user_stats = await prisma.reviews.groupBy({
    by: ["author_id"],
    _avg: {
      stars: true, // Calculate the average stars
    },
    _count: {
      stars: true, // Count the total number of reviews
    },
  });

  for (let i = 0; i < user_stats.length; i += BATCH_SIZE) {
    // create array of update promises
    const update_batch = user_stats.slice(i, i + BATCH_SIZE).map((user) =>
      prisma.users.update({
        where: {
          id: user.author_id,
        },
        data: {
          average_stars: +user._avg.stars.toFixed(2),
          review_count: user._count.stars,
        },
      })
    );

    await Promise.all(update_batch);

    console.log(
      `Updated users # ${i} / ${users.length} - ${(
        (i / users.length) *
        100
      ).toFixed(2)}%...`
    );
  }

  console.log("Users Update Complete");
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });
