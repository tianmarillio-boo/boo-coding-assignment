const { object, string, number } = require('yup');

const createProfileDto = object({
  name: string().required(),
  description: string().required(),
  mbti: string().required(),
  enneagram: string().required(),
  variant: string().required(),
  tritype: number().required(),
  socionics: string().required(),
  sloan: string().required(),
  psyche: string().required(),
});

module.exports = createProfileDto;
