const phoneNumber = [
  (val = "") => val.length > 0 || "ورودی الزامی است.",
  (val = "") => val.substring(0, 2) === "09" || "شماره باید با 09 شروع شود.",
  (val = "") => val.length === 11 || "شماره موبایل معتبر نیست.",
];
const required = [(val = "") => val.length !== 0 || "ورودی الزامی است."];
const attachments = [
  (val = []) => val.length !== 0 || "فایل الزامی است.",
  (val = []) => val.length <= 8 || "حداکثر تعداد فایل‌ها 8 تا است.",
];
const hour = [
  (val = "") => `${val}`.length !== 0 || "ورودی الزامی است.",
  (val = "") => (Number(val) >= 0 && Number(val) <= 24) || "ورودی نامعتبر است.",
];
const min = [
  (val = "") => `${val}`.length !== 0 || "ورودی الزامی است.",
  (val = "") => (Number(val) >= 0 && Number(val) <= 59) || "ورودی نامعتبر است.",
];

const rules = { phoneNumber, required, attachments, hour, min };
export default rules;
