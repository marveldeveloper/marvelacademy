import { activityStatus } from "../../../constants";

export default function questionInfo({
  firstName = "",
  lastName = "",
  status = "",
}) {
  return [
    {
      label: "نام و نام خانوادگی",
      value: `${firstName} ${lastName}`,
    },
    {
      label: "وضعیت",
      value: activityStatus.badge(status),
    },
  ];
}
