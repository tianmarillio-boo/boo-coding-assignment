const { object, string } = require('yup');

const MBTI_ENUM = [
  'INFP',
  'INFJ',
  'ENFP',
  'ENFJ',
  'INTJ',
  'INTP',
  'ENTP',
  'ENTJ',
  'ISFP',
  'ISFJ',
  'ESFP',
  'ESFJ',
  'ISTP',
  'ISTJ',
  'ESTP',
  'ESTJ',
];

const ENNEAGRAM_ENUM = [
  '1w2',
  '2w3',
  '3w2',
  '3w4',
  '4w3',
  '4w5',
  '5w4',
  '5w6',
  '6w5',
  '6w7',
  '7w6',
  '7w8',
  '8w7',
  '8w9',
  '9w8',
  '9w1',
];

const ZODIAC_ENUM = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

const createCommentDto = object({
  title: string().required(),
  text: string().required(),

  voting: object({
    mbti: string().oneOf(MBTI_ENUM).nullable(),
    enneagram: string().oneOf(ENNEAGRAM_ENUM).nullable(),
    zodiac: string().oneOf(ZODIAC_ENUM).nullable(),
  }),
});

module.exports = createCommentDto;
