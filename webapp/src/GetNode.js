export var Getters = {};

function GetNode(key) {
  const host = key.split('/', 1)[0];
  const getter = Getters[host];
  if (!getter) {
    throw new Error('unrecognized key host: ' + key);
  }
  return getter(key);
}

export default GetNode;
