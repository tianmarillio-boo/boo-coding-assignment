const Profile = require('../../models/profile');
const createProfileDto = require('./dto/create-profile.dto');

class ProfileController {
  static async create(req, res) {
    const { body } = req;

    // Sanitize request body
    createProfileDto.validateSync(body, { strict: true });

    // Find latest entry to determine new id
    // note: should use auto increment or other libraries for production
    const foundProfile = await Profile.findOne()
      .sort({ id: -1 })
      .limit(1)
      .exec();
    const id = foundProfile ? foundProfile.id + 1 : 1;

    const newProfile = await Profile.create({
      id,
      image:
        'https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_960_720.png',

      ...body,
    });
    await newProfile.save();

    return res.status(201).json({
      id: newProfile.id,
    });
  }

  static async findById(req, res) {
    const profile = await Profile.findOne({ id: req.params.profileId });

    if (!profile) {
      throw {
        name: 'NotFoundError',
        message: 'Profile not found',
      };
    }

    return await res.render('profile_template', {
      profile,
    });
  }
}

module.exports = ProfileController;
