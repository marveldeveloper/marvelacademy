export default function clearCaches() {
  if ("caches" in window) {
    window.caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
}
