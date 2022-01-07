const admin = [
  {
    label: "مدیریت ترم‌ها",
    path: "terms",
    icon: "card-list",
  },
  {
    label: "مدیریت تمرین‌ها",
    path: "homeworks",
    icon: "file-earmark-pdf",
  },
  {
    label: "مدیریت آزمون‌ها",
    path: "questions",
    icon: "menu-button-wide-fill",
  },
  // {
  //   label: "مدیریت کاربران",
  //   path: "users",
  //   icon: "people",
  // },
  // {
  //   label: "گزارش کاربران",
  //   path: "user-report",
  // },
  {
    label: "مدیریت ویدیوهای صفحه اصلی",
    path: "main-videos",
    icon: "skip-end-btn",
  },
  {
    label: "دسته‌بندی‌ها",
    path: "categories",
    icon: "bookmark",
  },
];
const user = [
  {
    label: "صفحه اصلی",
    path: "/",
  },
  {
    label: "ترم‌ها",
    path: "/student/terms",
  },
  // {
  //   label: "تمرین‌ها",
  //   path: "homeworks",
  // },
  // {
  //   label: "آزمون‌ها",
  //   path: "questions",
  // },
  {
    label: "مشاهده نتایج",
    path: "/student/results",
  },
  // {
  //   label: "پروفایل",
  //   path: "profile",
  // },
];
const navItems = {
  admin,
  user,
};
export default navItems;
