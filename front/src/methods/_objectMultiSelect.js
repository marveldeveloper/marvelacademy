import { cloneDeep } from "lodash";
export default function objectMultiSelect(keys = [], object = {}) {
  const subset = cloneDeep(
    keys.reduce((obj2, key) => {
      if (key in object)
        // line can be removed to make it inclusive
        obj2[key] = object[key];
      return obj2;
    }, {})
  );
  return subset;
}