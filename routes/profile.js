const express = require('express');

const router = express.Router();

const ProfileController = require('../controllers/profile/profile.controller');
const CommentController = require('../controllers/comment/comment.controller');

const authentication = require('../middlewares/authentication');

// const profiles = [
//   {
//     id: 1,
//     name: "A Martinez",
//     description: "Adolph Larrue Martinez III.",
//     mbti: "ISFJ",
//     enneagram: "9w3",
//     variant: "sp/so",
//     tritype: 725,
//     socionics: "SEE",
//     sloan: "RCOEN",
//     psyche: "FEVL",
//     image: "https://soulverse.boo.world/images/1.png",
//   },
// ];

module.exports = function () {
  router.post('/', ProfileController.create);
  router.get('/:profileId', ProfileController.findById);

  router.post('/:profileId/comment', CommentController.create);
  router.get('/:profileId/comment', CommentController.findAll);

  router.patch(
    '/:profileId/comment/:commentId/toggle-like',
    authentication,
    CommentController.toggleLike,
  );

  return router;
};
