import moment from "moment-jalaali";
export default function miladiToShamsi({
  date = new Date(),
  locale = "fa",
  format = "jYYYY/jMM/jDD",
}) {
  return moment(date).locale(locale).format(format);
}
