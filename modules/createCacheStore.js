import createStore from "./redux-zero.preact.min.js";
import debounce from "./debounce.js";

export default function createCacheStore(KEY, initialState) {
  let state = JSON.parse(localStorage.getItem(KEY));
  if (state == null) state = initialState;

  const store = createStore(state);
  store.subscribe(
    debounce((state) => {
      localStorage.setItem(KEY, JSON.stringify(state));
    }, 1000)
  );

  return store;
}
