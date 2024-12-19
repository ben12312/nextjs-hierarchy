export function findInNestedArray(arr, id) {
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    if (current.id == id) {
      result = current.name;
      break;
    }
    if (current.children.length > 0) {
      const res = findInNestedArray(current.children, id);
      if (res) {
        result = res;
        break;
      }
    } else {
      if (current.id == id) {
        result = current.name;
        break;
      }
    }
  }
  return result;
}
