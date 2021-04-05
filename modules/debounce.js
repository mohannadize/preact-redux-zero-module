function debounce(c, l) {
  let t = null;
  return function (...a) {
    if (t !== null) clearTimeout(t);
    else c(...a);
    t = setTimeout(() => {
      c(...a);
      clearTimeout(t);
      t = null;
    }, l);
  };
}

export default debounce;
