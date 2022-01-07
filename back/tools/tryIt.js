function tryIt(fn, ...args) {
  try {
    return fn(...args);
  } catch {}
}

export default tryIt;
