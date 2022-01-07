'use strict';
const c = require('config');
const { deepCopy } = require('../tools/object');

// for numbers - maximum, minimum, exclusiveMaximum, exclusiveMinimum, multipleOf
const numberSchema = (
  dataType = 'number',
  minValue = null,
  maxValue = null,
  enumValues = null
) => {
  let result = { type: dataType };
  if (minValue != null) result.minimum = minValue;
  if (maxValue != null) result.maximum = maxValue;
  if (enumValues != null) result.enum = enumValues;

  return result;
};

// for strings - maxLength, minLength, pattern, format
const stringSchema = (
  minLength = null,
  maxLength = null,
  format = null,
  enumValues = null
) => {
  let result = { type: 'string' };
  if (minLength != null) result.minLength = minLength;
  if (maxLength != null) result.maxLength = maxLength;
  if (enumValues != null) result.enum = enumValues;
  if (format != null) result.format = format;

  return result;
};

// for arrays - maxItems, minItems, uniqueItems, items, additionalItems, contains
const arraySchema = (
  maxItems = null,
  minItems = null,
  enumValues = null,
  items = null
) => {
  let result = { type: 'array' };
  if (maxItems != null) result.maxItems = maxItems;
  if (minItems != null) result.minItems = minItems;
  if (enumValues != null) result.enum = enumValues;
  if (items != null) result.items = items;

  return result;
};

// for objects - maxProperties, minProperties, required, properties, patternProperties, additionalProperties, dependencies, propertyNames
const objectSchema = (
  properties = null,
  required = null,
  additionalProperties = false,
  maxProperties = null,
  minProperties = null
) => {
  let result = { type: 'object', additionalProperties };
  if (maxProperties != null) result.maxProperties = maxProperties;
  if (minProperties != null) result.minProperties = minProperties;
  if (required != null) result.required = required;
  if (properties != null) result.properties = properties;

  return result;
};

// number values
const positiveInteger = (maximum) => numberSchema('integer', 0, maximum);

const percentage = numberSchema('number', 0, 100);

const integer = (maximum) => numberSchema('integer', null, maximum);

const boolean = numberSchema('boolean');

const sortOrder = numberSchema('number', null, null, [0, -1, 1]);

const url = stringSchema(0, 256, 'url');

const numberString = (maxLength) => stringSchema(0, maxLength, 'number');

const rawString = (maxLength) => stringSchema(0, maxLength, 'string');

const text = (maxLength) => stringSchema(1, maxLength, 'text');

const name = stringSchema(1, 50, 'name');

const objectId = stringSchema(null, null, 'objectId');

const email = stringSchema(null, c.get('mediumStringLen'), 'email');

const dateSchema = stringSchema(null, null, 'date');

const langSchema = stringSchema(null, null, null, ['fa', 'en']);

const dateTimeSchema = stringSchema(null, null, 'datetime');

const sortSchema = stringSchema(null, c.get('smallStringLen'), 'sort');

const phoneNumber = stringSchema(c.get('minPhoneLen'), c.get('maxPhoneLen'), 'phone');

const searchSchema = stringSchema(c.get('minSearchLen'), c.get('maxSearchLen'), 'text');

// enum values
const enumString = (values) => stringSchema(null, null, null, values);

const gender = enumString(['male', 'female']);

const numberAction = positiveInteger(c.get('smallNumber'));

const arrayAction = arraySchema(c.get('superSmallNumber'), 0);

const status = enumString(['active', 'inactive']);

const _id = objectSchema({ _id: objectId }, ['_id']);

const listResult = objectSchema({
  status: status,
  startDate: dateTimeSchema,
  endDate: dateTimeSchema,
  sort: sortSchema,
  search: searchSchema,
  lang: langSchema,
  page: numberString(c.get('pageStringLen')),
  perPage: numberString(c.get('perPageStringLen')),
});

// functionalities
const updateSchema = (addSchema, properties = []) => {
  let schema = objectSchema({ _id: objectId }, ['_id']);

  let filtered;
  if (properties.length > 0) {
    filtered = properties.reduce((obj, key) => {
      obj[key] = addSchema.properties[key];
      return obj;
    }, {});
  } else {
    filtered = addSchema.properties;
  }

  Object.assign(schema.properties, filtered);
  return schema;
};

const addProperties = (schema, properties, required = []) => {
  let result = deepCopy(schema);
  Object.assign(result.properties, properties);
  result.required.push(...required);
  return result;
};

const removeProperties = (schema, properties) => {
  let result = deepCopy(schema);
  properties.forEach((key) => {
    delete result.properties[key];
    const index = result.required.indexOf(key);
    if (index > -1) {
      result.required.splice(index, 1);
    }
  });
  return result;
};

module.exports = {
  _id,
  numberAction,
  arrayAction,
  dateTimeSchema,
  dateSchema,
  phoneNumber,
  boolean,
  objectId,
  sortOrder,
  email,
  listResult,
  langSchema,
  gender,
  name,
  percentage,
  addProperties,
  removeProperties,
  enumString,
  numberString,
  numberSchema,
  stringSchema,
  arraySchema,
  objectSchema,
  rawString,
  text,
  integer,
  positiveInteger,
  updateSchema,
  url,
};
