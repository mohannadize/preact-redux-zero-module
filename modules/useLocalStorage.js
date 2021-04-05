import {useState, useEffect} from "./preact/hooks.js";

const PREFIX = "PREFIX-";

export default function useLocalStorage(key, initialValue) {
  const prefixedKey = `${PREFIX}${key}`;
  const [value, setValue] = useState(()=>{
    const savedValue = JSON.parse(localStorage.getItem(prefixedKey));
    if (savedValue != null) return savedValue;

    if (initialValue instanceof Function) return initialValue();
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [value])
  
  return [value, setValue];
}