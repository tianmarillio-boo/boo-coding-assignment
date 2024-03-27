const Comment = require('../../models/comment');
const Profile = require('../../models/profile');
const createCommentDto = require('./dto/create-comment.dto');

class CommentController {
  static async create(req, res) {
    const { profileId } = req.params;
    const { body, username } = req;

    // Sanitize
    createCommentDto.validateSync(body, { strict: true });

    // Find latest entry to determine new id
    // note: should use auto increment or other libraries for production
    const foundComment = await Comment.findOne()
      .sort({ id: -1 })
      .limit(1)
      .exec();
    const id = foundComment ? foundComment.id + 1 : 1;

    // Find profile
    const foundProfile = await Profile.findOne({ id: profileId }).exec();
    if (!foundProfile) {
      throw {
        name: 'NotFoundError',
        message: 'Profile not found',
      };
    }

    // Create comment
    const newComment = await Comment.create({
      id,
      username,
      ...body,

      profile: foundProfile._id,
    });
    await newComment.save();

    // Push profile.comments ref
    foundProfile.comments.push(newComment._id);
    foundProfile.save();

    return res.status(201).json({
      id: newComment.id,
    });
  }

  static async findAll(req, res) {
    const { params, query } = req;
    const { profileId } = params;

    // Parse req.query
    const { sorting, filter } = query;

    // Get sorting query
    const sortingQueryDict = {
      best: {
        likesCount: -1,
      },
      recent: {
        createdAt: -1,
      },
    };
    const sortingQuery = sortingQueryDict[sorting];

    // Get personality system filter query
    const getVotingFilter = (attribute) => ({
      [`voting.${attribute}`]: {
        $ne: null,
      },
    });
    const filterQueryDict = {
      mbti: getVotingFilter('mbti'),
      enneagram: getVotingFilter('enneagram'),
      zodiac: getVotingFilter('zodiac'),
    };
    const filterQuery = filterQueryDict[filter];

    // Get profile
    const profile = await Profile.findOne({ id: profileId })
      .select({ _id: 1 })
      .exec();

    // Build comments aggregation pipeline to sort & filter
    const commentPipeline = [
      {
        $match: {
          profile: profile._id,
        },
      },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
        },
      },
    ];

    if (filterQuery) {
      commentPipeline.push({
        $match: filterQuery,
      });
    }

    if (sortingQuery) {
      commentPipeline.push({
        $sort: sortingQuery,
      });
    }

    // Find list of comments by Profile with sorting and filter queries
    const comments = await Comment.aggregate(commentPipeline).exec();

    res.status(200).json({ comments });
  }

  static async toggleLike(req, res) {
    const { params, username } = req;
    const { profileId, commentId } = params;

    // Get profile
    const profile = await Profile.findOne({ id: profileId })
      .populate({
        path: 'comments',
        match: {
          id: commentId,
        },
      })
      .exec();

    // Validate profile
    if (!profile) {
      throw {
        name: 'NotFoundError',
        message: 'Profile not found',
      };
    }

    // Validate comment
    if (!profile.comments.length) {
      throw {
        name: 'NotFoundError',
        message: 'Comment not found',
      };
    }

    // Check if likes contain user
    const [comment] = profile.comments;
    const { likes } = comment;
    const hasLike = !!likes.find((like) => like.username === username);

    // Toggle like based on hasLike
    if (hasLike) {
      comment.likes.pull({ username });
      comment.save();
    } else {
      comment.likes.push({ username });
      comment.save();
    }

    return res.json({
      profileId,
      commentId,
      message: hasLike ? 'Unliked' : 'Liked',
    });
  }
}

module.exports = CommentController;
