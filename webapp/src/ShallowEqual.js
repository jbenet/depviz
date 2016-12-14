function ShallowEqual(a, b) {
  var key;
  for (key in a) {
    if (Object.prototype.hasOwnProperty.call(a, key) &&
        (!(key in b) || a[key] !== b[key])) {
      return false;
    }
  }
  for (key in b) {
    if (Object.prototype.hasOwnProperty.call(b, key) && !(key in a)) {
      return false;
    }
  }
  return true;
}

export default ShallowEqual;
