const prisma = require("./index");

const createComment = (data) => {
  return prisma.comment.create({ data });
};

const updateComment = (id, comment_text) => {
  console.log(comment_text);
  return prisma.comment.update({
    where: { id },
    data: {
      comment_text,
      updated_at: new Date(),
    },
  });
};

const deleteComment = (id) => {
  return prisma.comment.delete({
    where: { id },
  });
};

module.exports = {
  createComment,
  deleteComment,
  updateComment,
};
