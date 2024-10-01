// REMEMBER REVIEWS GO ALL THE WAY PAST 4000000 NOW
// AND REMEMBER TO CHANGE THE DATE LIKE IN SEED_COMMENTS1
// remember text is now comment_text
const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient({
  log: ["info"],
});

async function main() {
  // find all users to assign random user to each seeded comment
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  // create comments for reviews 500000 reviews at a time, skipping every other 500000
  // will be adding on to pre seeded comments

  async function commentSeed1() {
    // use pagination to get reviews, too big to find all at once
    // will assign 1 comment to each review
    const reviews = await prisma.review.findMany({
      skip: 2500000,
      take: 250000,
    });

    console.log("Creating comments 1/4...");
    await Promise.all(
      [...reviews].map((review) => {
        //pick random user index from all users array
        let rand_user = Math.floor(Math.random() * (users.length - 1));

        // check if random user is the same as reviews author and change index if true
        if (users[rand_user].id === review.author_id) {
          // if rand_user is the last user, subtract one instead of adding as index would be out of range otherwise
          if (rand_user === users.length - 1) {
            rand_user -= 1;
          } else {
            rand_user += 1;
          }
        }

        [...Array(1)].map(async () => {
          await prisma.comment.create({
            data: {
              comment_text: faker.lorem.lines({ min: 1, max: 2 }),
              author_id: users[rand_user].id,
              review_id: review.id,
              created_at: faker.date.between({
                from: review.created_at,
                to: new Date(),
              }),
            },
          });
        });
      })
    );

    const comments = await prisma.review.findMany({
      skip: 2500000,
      take: 10,
      include: {
        comments: true,
      },
    });

    for (const comment of comments) {
      console.log(comment);
    }
    console.log("Seeding 1/4 completed...");
  }
  async function commentSeed2() {
    // use pagination to get reviews, too big to find all at once
    // will assign 1 comment to each review
    const reviews = await prisma.review.findMany({
      skip: 3000000,
      take: 250000,
    });

    console.log("Creating comments 2/4...");
    await Promise.all(
      [...reviews].map((review) => {
        //pick random user index from all users array
        let rand_user = Math.floor(Math.random() * (users.length - 1));

        // check if random user is the same as reviews author and change index if true
        if (users[rand_user].id === review.authorId) {
          // if rand_user is the last user, subtract one instead of adding as index would be out of range otherwise
          if (rand_user === users.length - 1) {
            rand_user -= 1;
          } else {
            rand_user += 1;
          }
        }

        [...Array(1)].map(async () => {
          await prisma.comment.create({
            data: {
              comment_text: faker.lorem.lines({ min: 1, max: 2 }),
              author_id: users[rand_user].id,
              review_id: review.id,
              created_at: faker.date.between({
                from: review.created_at,
                to: new Date(),
              }),
            },
          });
        });
      })
    );

    const comments = await prisma.review.findMany({
      skip: 3000000,
      take: 10,
      include: {
        comments: true,
      },
    });

    for (const comment of comments) {
      console.log(comment);
    }
    console.log("Seeding 2/4 completed...");
  }
  async function commentSeed3() {
    // use pagination to get reviews, too big to find all at once
    // will assign 1 comment to each review
    const reviews = await prisma.review.findMany({
      skip: 3500000,
      take: 250000,
    });

    console.log("Creating comments 3/4...");
    await Promise.all(
      [...reviews].map((review) => {
        //pick random user index from all users array
        let rand_user = Math.floor(Math.random() * (users.length - 1));

        // check if random user is the same as reviews author and change index if true
        if (users[rand_user].id === review.authorId) {
          // if rand_user is the last user, subtract one instead of adding as index would be out of range otherwise
          if (rand_user === users.length - 1) {
            rand_user -= 1;
          } else {
            rand_user += 1;
          }
        }

        [...Array(1)].map(async () => {
          await prisma.comment.create({
            data: {
              comment_text: faker.lorem.lines({ min: 1, max: 2 }),
              author_id: users[rand_user].id,
              review_id: review.id,
              created_at: faker.date.between({
                from: review.created_at,
                to: new Date(),
              }),
            },
          });
        });
      })
    );

    const comments = await prisma.review.findMany({
      skip: 3500000,
      take: 10,
      include: {
        comments: true,
      },
    });

    for (const comment of comments) {
      console.log(comment);
    }
    console.log("Seeding 3/4 completed...");
  }
  async function commentSeed4() {
    // use pagination to get reviews, too big to find all at once
    // will assign 1 comment to each review
    const reviews = await prisma.review.findMany({
      skip: 4000000,
      take: 250000,
    });

    console.log("Creating comments 4/4...");
    await Promise.all(
      [...reviews].map((review) => {
        //pick random user index from all users array
        let rand_user = Math.floor(Math.random() * (users.length - 1));

        // check if random user is the same as reviews author and change index if true
        if (users[rand_user].id === review.authorId) {
          // if rand_user is the last user, subtract one instead of adding as index would be out of range otherwise
          if (rand_user === users.length - 1) {
            rand_user -= 1;
          } else {
            rand_user += 1;
          }
        }

        [...Array(1)].map(async () => {
          await prisma.comment.create({
            data: {
              comment_text: faker.lorem.lines({ min: 1, max: 2 }),
              author_id: users[rand_user].id,
              review_id: review.id,
              created_at: faker.date.between({
                from: review.created_at,
                to: new Date(),
              }),
            },
          });
        });
      })
    );

    const comments = await prisma.review.findMany({
      skip: 4000000,
      take: 10,
      include: {
        comments: true,
      },
    });

    for (const comment of comments) {
      console.log(comment);
    }
  }
  commentSeed1()
    .then(() => commentSeed2())
    .then(() => commentSeed3())
    .then(() => commentSeed4())
    .then(() => console.log("Seeded comments."))
    .catch((e) => {
      console.log(e);
    });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
