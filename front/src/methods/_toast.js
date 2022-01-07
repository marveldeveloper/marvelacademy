import hotToast from "react-hot-toast";
export default function toast({
  text = "",
  type = "success",
  duration = 5000,
}) {
  const color = type === "error" ? "var(--bs-danger)" : "var(--bs-success)";
  hotToast[type](text, {
    duration,
    style: {
      borderRadius: "0.3rem",
      background: "var(--bs-dark)",
      whiteSpace: "pre-wrap",
      color,
    },
  });
}
