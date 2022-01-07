'use strict';
const messages = {
  input: {
    en: 'input',
    fa: 'ورودی',
  },
};

const errors = {
  notFound: {
    code: 129,
    status: 404,
    en: 'Url not found.',
    fa: 'مسیر پیدا نشد.',
  },
  itemNotFound: {
    code: 130,
    status: 404,
    en: 'entity not found.',
    fa: 'آیتم پیدا نشد',
  },
  categoryNotFound: {
    code: 131,
    status: 404,
    en: 'category not found.',
    fa: 'کتگوری پیدا نشد',
  },
  notHomework: {
    code: 132,
    status: 404,
    en: 'activity type not homework.',
    fa: 'جنس فعایت از نوع تمرین نیست.',
  },
  alreadyAnswered: {
    code: 133,
    status: 400,
    en: 'Already answered.',
    fa: 'قبلا در این امتحان شرکت کرده اید',
  },
  timesUp: {
    code: 134,
    status: 400,
    en: 'Time is up.',
    fa: 'زمان پاسخگویی به پایان رسیده است',
  },
  alreadyReviewed: {
    code: 135,
    status: 400,
    en: 'Already reviewed.',
    fa: 'قبلا بررسی شده است',
  },
  termNotFound: {
    code: 136,
    status: 404,
    en: 'Term not found.',
    fa: 'ترم پیدا نشد.',
  },
  activityNotVideo: {
    code: 137,
    status: 400,
    en: 'The activity type is not video.',
    fa: 'روی این فعالیت ویدیو نمیاد.',
  },
  activityNotExam: {
    code: 138,
    status: 400,
    en: 'The activity type is not exam.',
    fa: 'روی این فعالیت آزمون نمیاد.',
  },
  activityVideo: {
    code: 139,
    status: 400,
    en: 'The activity type needs video not normal files.',
    fa: 'از مسیر ویدیو امتحان کنید.',
  },
  internalServerError: {
    code: 140,
    status: 500,
    en: 'Internal server error',
    fa: 'خطای داخلی.',
  },
  authenticationFailed: {
    code: 141,
    status: 403,
    en: 'Authentication failed.',
    fa: 'تأیید اعتبار ناموفق بود.',
  },
  authenticationFailedWith401: {
    code: 142,
    status: 401,
    en: 'Authentication failed.',
    fa: 'تأیید اعتبار ناموفق بود.',
  },
  accessDenied: {
    code: 143,
    status: 403,
    en: 'Access denied.',
    fa: 'دسترسی مقدور نیست.',
  },
  phoneExists: {
    code: 144,
    status: 400,
    en: 'Phone exists',
    fa: 'شماره موبال وجود دارد.',
  },
  fileRequired: {
    code: 145,
    status: 400,
    en: 'File is required',
    fa: 'فایل الزامی است',
  },
  duplicateIndex: {
    code: 146,
    status: 400,
    en: 'index already exists',
    fa: ' ترمی با این مقدار index وجود دارد',
  },
  addPreviousActivity: {
    code: 147,
    status: 400,
    en: 'add previous activities first',
    fa: 'ابتدا فعالیت قبلی را اضافه کنید',
  },
  duplicateCategory: {
    code: 148,
    status: 400,
    en: 'category already exists',
    fa: 'کتگوری وجود دارد',
  },
  notUnlocked: {
    code: 149,
    status: 400,
    en: 'please complete previous terms first',
    fa: 'لطفا ابتدا ترم های قبلی را به پایان برسانید',
  },
  sectionNotDeleted: {
    code: 150,
    status: 200,
    en: 'section not deleted maybe it doesnt exists',
    fa: 'سکشن حذف نشد، شاید وجود ندارد',
  },
  duplicateUsername: {
    code: 151,
    status: 400,
    en: 'username already taken',
    fa: 'نام کاربری وجود دارد',
  },
  examExists: {
    code: 152,
    status: 400,
    en: 'exam exists',
    fa: 'آزمون قبلا تعریف شده است',
  },
};

const validationErrorValues = {
  type: {
    fa: '%s باید از نوع %s باشد.',
    en: '%s should be %s.',
  },
  additionalRootProperty: {
    fa: 'نباید شامل %s باشد.',
    en: 'should not have property %s.',
  },
  requiredRootProperty: {
    fa: 'فیلد %s ضروری است.',
    en: '%s is required.',
  },
  additionalProperty: {
    fa: '%s نباید شامل %s باشد.',
    en: '%s should not have property %s.',
  },
  requiredProperty: {
    fa: 'فیلد %s از %s ضروری است.',
    en: 'field %s of %s is required.',
  },
  maxValue: {
    fa: '%s باید از %s کوچکتر باشد.',
    en: '%s must be less than %s.',
  },
  minValue: {
    fa: '%s باید از %s بزرگتر باشد.',
    en: '%s must be greater than %s.',
  },
  enumValue: {
    fa: '%s باید از مجموعه %s باشد.',
    en: '%s should be from %s.',
  },
  maxLength: {
    fa: 'طول %s باید از %s کوچکتر باشد.',
    en: '%s should have more than %s items.',
  },
  minLength: {
    fa: 'طول %s باید از %s بزرگتر باشد.',
    en: '%s should have less than %s items.',
  },
  enumArray: {
    fa: 'مقادیر %s باید از مجموعه %s باشد.',
    en: 'Items of %s should be from %s.',
  },
  minRootKeys: {
    fa: 'تعداد کلیدهاباید از %s بیشتر باشد',
    en: 'should have more than %s keys.',
  },
  maxRootKeys: {
    fa: 'تعداد کلیدها باید از %s کمتر باشد',
    en: 'should have less than %s keys.',
  },
  minKeys: {
    fa: 'تعداد کلیدهای %s باید از %s بیشتر باشد',
    en: '%s should have more than %s keys.',
  },
  maxKeys: {
    fa: 'تعداد کلیدهای %s باید از %s کمتر باشد',
    en: '%s should have less than %s keys.',
  },
  invalidFormat: {
    fa: 'فرمت %s نامعتبر',
    en: 'Invalid format for %s',
  },
};

const validationFormatErrors = {
  name: {
    fa: '%s نمی تواند شامل کاراکتر غیر حروف انگلیسی باشد.',
    en: '%s can not include non-letter english characters.',
  },
  string: {
    fa: '%s نمی تواند شامل کاراکترهای خاص باشد.',
    en: '%s can not include special characters.',
  },
  text: {
    fa: '%s نمی تواند شامل کاراکتر غیر از اعداد و حروف باشد.',
    en: '%s can not include non-letter-number characters.',
  },
  enNumber: {
    fa: '%s نمی تواند شامل کاراکتر غیر از عدد انگلیسی باشد.',
    en: '%s can not include non-english-letter characters.',
  },
  faNumber: {
    fa: '%s نمی تواند شامل کاراکتر غیر از عدد انگلیسی باشد.',
    en: '%s can not include non-farsi-letter characters.',
  },
  enLetter: {
    fa: '%s نمی تواند شامل کاراکتر غیر از حروف انگلیسی باشد.',
    en: '%s can not include non-english-letter characters.',
  },
  faLetter: {
    fa: '%s نمی تواند شامل کاراکتر غیر از حروف فارسی باشد.',
    en: '%s can not include non-farsi-letter characters.',
  },
  letter: {
    fa: '%s نمی تواند شامل کاراکتر غیر از حروف باشد.',
    en: '%s can not include non-letter characters.',
  },
  enText: {
    fa: '%s نمی تواند شامل کاراکتر غیر از حروف واعداد انگلیسی باشد.',
    en: '%s can not include non-english-letter-number characters.',
  },
  faText: {
    fa: '%s نمی تواند شامل کاراکتر غیر از حروف و اعداد فارسی باشد.',
    en: '%s can not include non-farsi-letter-number characters.',
  },
  default: {
    fa: 'فرمت %s نامعتبر است.',
    en: '%s has invalid format.',
  },
};

module.exports = {
  validationFormatErrors,
  validationErrorValues,
  errors,
  messages,
};
