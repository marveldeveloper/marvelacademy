'use strict';
const { translate } = require('./message');
const {
  validationFormatErrors,
  validationErrorValues,
  messages,
} = require('./messageText');

let lang;

function combineRegExps() {
  let combined = '(';
  for (let i = 0; i < arguments.length; i++) {
    combined += '(';
    if (i != arguments.length - 1) combined += arguments[i] + ')|';
    else combined += arguments[i] + ')';
  }
  return combined + ')';
}

const enNumberRange = '[0-9]';
const enCharRange = '[a-zA-Z]';
const faNumberRange = '[\u06F0-\u06F9]';
const faCharRange = [
  '[\u06A9\u06AF\u06C0\u06CC\u060C\u062A\u062B\u062C\u062D\u062E\u062F\u063A\u064A\u064B\u064C',
  '\u064D\u064E\u064F\u067E\u0670\u0686\u0698\u200C\u0621-\u0629\u0630-\u0639\u0641-\u0654]',
].join('');

const enNumberRegex = new RegExp('^' + enNumberRange + '+$');
const faNumberRegex = new RegExp('^' + faNumberRange + '+$');
const numberRegex = new RegExp('^' + combineRegExps(enNumberRange, faNumberRange) + '+$');
const enLetterRegex = new RegExp('^' + enCharRange + '+$');
const faLetterRegex = new RegExp('^' + faCharRange + '+$');
const letterRegex = new RegExp('^' + combineRegExps(enCharRange, faCharRange) + '+$');
const enTextRegex = new RegExp(
  '^' + combineRegExps(enNumberRange, enCharRange, ' ') + '+$'
);
const faTextRegex = new RegExp(
  '^' + combineRegExps(faNumberRange, faCharRange, '\\s') + '+$'
);
const textRegex = new RegExp(
  '^' +
    combineRegExps(faNumberRange, faCharRange, enNumberRange, enCharRange, ' ', '\\s') +
    '+$'
);
const urlRegex = new RegExp(
  'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)'
);
const fcmRegex = new RegExp('^[0-9a-zA-Z-_]*$');
const phoneRegex = new RegExp('^[+]' + enNumberRange + '{5,30}$');
// const phoneRegex = new RegExp('/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im');
const objectIdRegex = new RegExp('^[0-9a-fA-F]{24}$');
const stringRegex = new RegExp('^[^;<>$#@%`~:&^{}]*$');
const string2Regex = new RegExp('^[^;<>`&^{}]*$');
const nameRegex = new RegExp('^' + combineRegExps(enCharRange, ' ', '\\s') + '+$');
const dateRegex = new RegExp('^[0-9]{2}(-)(0?[1-9]|1[012])(-)(0?[1-9]|[12][0-9]|3[01])$');
const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const dateTimeRegex = new RegExp(
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
);

const validateSort = (data) => {
  let parts = data.split(',');
  for (let i = 0; i < parts.length; i++) {
    let sortItem = parts[i].split(':');
    if (sortItem[1] != 1 && sortItem[1] != -1) return false;
    if (!enLetterRegex.test(sortItem[0])) return false;
  }
  return true;
};

const validateFromat = (data, format) => {
  switch (format) {
    case 'date':
      return dateRegex.test(data);
    case 'fcm':
      return fcmRegex.test(data);
    case 'name':
      return nameRegex.test(data);
    case 'url':
      return urlRegex.test(data);
    case 'phone':
      return phoneRegex.test(data);
    case 'number':
      return numberRegex.test(data);
    case 'string':
      return stringRegex.test(data);
    case 'string2':
      return string2Regex.test(data);
    case 'freeRawString':
      return true;
    case 'objectId':
      return objectIdRegex.test(data);
    case 'text':
      return textRegex.test(data);
    case 'enNumber':
      return enNumberRegex.test(data);
    case 'faNumber':
      return faNumberRegex.test(data);
    case 'enLetter':
      return enLetterRegex.test(data);
    case 'faLetter':
      return faLetterRegex.test(data);
    case 'letter':
      return letterRegex.test(data);
    case 'enText':
      return enTextRegex.test(data);
    case 'faText':
      return faTextRegex.test(data);
    case 'email':
      return emailRegex.test(data);
    case 'datetime':
      return dateTimeRegex.test(data);
    case 'sort':
      return validateSort(data);
    case 'persianDate':
      return validatePersianDate(data);
  }
};

const getError = (message, key) => {
  let result = {};
  if (!key) key = translate(messages, 'input', lang);
  result[key] = message;
  return result;
};

const pushValidationError = (errors, messageKey, messageParams) => {
  let key = messageParams.length == 1 ? null : messageParams[0];
  errors.push(
    getError(translate(validationErrorValues, messageKey, lang, messageParams), key)
  );
};

const getFromatError = (format, key) => {
  switch (format) {
    case 'name':
      return translate(validationFormatErrors, 'name', lang, [key]);
    case 'string':
      return translate(validationFormatErrors, 'string', lang, [key]);
    case 'text':
      return translate(validationFormatErrors, 'text', lang, [key]);
    case 'enNumber':
      return translate(validationFormatErrors, 'enNumber', lang, [key]);
    case 'faNumber':
      return translate(validationFormatErrors, 'faNumber', lang, [key]);
    case 'enLetter':
      return translate(validationFormatErrors, 'enLetter', lang, [key]);
    case 'faLetter':
      return translate(validationFormatErrors, 'faLetter', lang, [key]);
    case 'letter':
      return translate(validationFormatErrors, 'letter', lang, [key]);
    case 'enText':
      return translate(validationFormatErrors, 'enText', lang, [key]);
    case 'faText':
      return translate(validationFormatErrors, 'faText', lang, [key]);
    default:
      return translate(validationFormatErrors, 'default', lang, [key]);
  }
};

const getTypeError = (key, value, type) => {
  let param = translate(messages, type, lang);
  let errors = [];
  if (type == 'integer') {
    if (!Number.isInteger(value)) pushValidationError(errors, 'type', [key, param]);
  } else if (type == 'array') {
    if (!Array.isArray(value)) pushValidationError(errors, 'type', [key, param]);
  } else {
    if (typeof value !== type) pushValidationError(errors, 'type', [key, param]);
  }
  return errors;
};

const validateObjectProperties = (data, properties) => {
  let errors = [];
  Object.keys(properties).forEach((property) => {
    if (data[property] !== undefined)
      errors.push(...validate(data[property], properties[property], lang, property));
  });
  return errors;
};

const checkAdditionalProperties = (data, properties, key) => {
  let errors = [];
  Object.keys(data).forEach((k) => {
    if (!properties.includes(k)) {
      if (key) pushValidationError(errors, 'additionalProperty', [k, key]);
      else pushValidationError(errors, 'additionalRootProperty', [k]);
    }
  });
  return errors;
};

const validateRequiredValues = (data, required, key) => {
  let errors = [];
  required.forEach((r) => {
    if (!Object.keys(data).includes(r)) {
      if (key) pushValidationError(errors, 'requiredProperty', [r, key]);
      else pushValidationError(errors, 'requiredRootProperty', [r]);
    }
  });
  return errors;
};

const validateArraySchema = (values, schema, key) => {
  let errors = [];
  values.forEach((value) => {
    errors.push(...validate(value, schema, lang, key));
  });
  return errors;
};

const validateArrayEnum = (values, enumValues) => {
  for (let i = 0; i < values.length; i++) {
    if (!enumValues.includes(values[i])) return false;
  }
  return true;
};

const numberValidate = (value, schema, key) => {
  let error = getTypeError(key, value, 'number');
  if (error.length) return error;

  let errors = [];

  if ('maximum' in schema && value > schema.maximum)
    pushValidationError(errors, 'maxValue', [key, schema.maximum]);
  if ('minimum' in schema && value < schema.minimum)
    pushValidationError(errors, 'minimum', [key, schema.minimum]);
  if ('enum' in schema && !schema.enum.includes(value))
    pushValidationError(errors, 'enumValue', [key, schema.enum]);

  return errors;
};

const integerValidate = (value, schema, key) => {
  let error = getTypeError(key, value, 'integer');
  if (error.length) return error;
  let errors = [];
  errors.push(...numberValidate(value, schema, key));
  return errors;
};

const booleanValidate = (value, key) => {
  return getTypeError(key, value, 'boolean');
};

const stringValidate = (value, schema, key) => {
  let error = getTypeError(key, value, 'string');
  if (error.length) return error;
  let errors = [];

  if ('minLength' in schema && value.length < schema.minLength)
    pushValidationError(errors, 'minLength', [key, schema.minLength]);

  if ('maxLength' in schema && value.length > schema.maxLength)
    pushValidationError(errors, 'maxLength', [key, schema.maxLength]);
  if ('enum' in schema && !schema.enum.includes(value))
    pushValidationError(errors, 'enumValue', [key, schema.enum]);
  if ('format' in schema && !validateFromat(value, schema.format))
    errors.push(getError(getFromatError(schema.format, key), key));

  return errors;
};

const arrayValidate = (value, schema, key) => {
  let error = getTypeError(key, value, 'array');
  if (error.length) return error;
  let errors = [];

  if ('maxItems' in schema && value.length > schema.maxItems)
    pushValidationError(errors, 'maxItems', [key, schema.maxItems]);
  if ('minItems' in schema && value.length < schema.minItems)
    pushValidationError(errors, 'minItems', [key, schema.minItems]);
  if ('enum' in schema && !validateArrayEnum(value, schema.enum))
    pushValidationError(errors, 'enumValue', [key, schema.enum]);
  if ('items' in schema) errors.push(...validateArraySchema(value, schema.items, key));

  return errors;
};

const objectValidate = (value, schema, key) => {
  let error = getTypeError(key, value, 'object');
  if (error.length) return error;

  let errors = [];
  if (schema.additionalProperties == false)
    errors.push(...checkAdditionalProperties(value, Object.keys(schema.properties), key));
  if ('maxProperties' in schema && Object.keys(value).length > schema.maxProperties) {
    if (key) pushValidationError(errors, 'maxKeys', [key, schema.maxProperties]);
    else pushValidationError(errors, 'maxRootKeys', [schema.maxProperties]);
  }
  if ('minProperties' in schema && Object.keys(value).length < schema.minProperties) {
    if (key) pushValidationError(errors, 'minKeys', [key, schema.minProperties]);
    else pushValidationError(errors, 'minRootKeys', [schema.minProperties]);
  }
  if ('required' in schema)
    errors.push(...validateRequiredValues(value, schema.required, key));

  errors.push(...validateObjectProperties(value, schema.properties));

  return errors;
};

const validate = (value, schema, language, key = '') => {
  lang = language;

  switch (schema.type) {
    case 'string':
      return stringValidate(value, schema, key);
    case 'freeRawString':
      return stringValidate(value, schema, key);
    case 'number':
      return numberValidate(value, schema, key);
    case 'integer':
      return integerValidate(value, schema, key);
    case 'boolean':
      return booleanValidate(value, key);
    case 'array':
      return arrayValidate(value, schema, key);
    case 'object':
      return objectValidate(value, schema, key);
    default:
      if (schema.oneOf) {
        for (let i in schema.oneOf) {
          if (validate(value, schema.oneOf[i], lang, key).length == 0) return [];
        }
        let errors = [];
        pushValidationError(errors, 'invalidFormat', [key]);
        return errors;
      }
  }
};

module.exports = validate;
