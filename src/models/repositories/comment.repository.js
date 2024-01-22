const comment = require("../../models/comment.model");

const findComment = async ({ comment_id, unSelect }) => {
  return await comment
    .findOne({ _id: comment_id })
    .select(getUnSelectData(unSelect))
    .lean();
};

const checkCommentExist = async ({ comment_id }) => {
  const foundComment = await findComment({ comment_id });
  if (!foundComment) throw new NotFoundError("Comment not found");
};

module.exports = {
  findComment,
  checkCommentExist,
};
