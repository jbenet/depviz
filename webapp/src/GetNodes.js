export var Canonicalizers = {};
export var Getters = {};

function handler(key, handlers) {
  const host = key.split('/', 1)[0];
  const handler = handlers[host];
  if (!handler) {
    throw new Error('unrecognized key host: ' + key);
  }
  return handler;
}

export function CanonicalKey(key) {
  return handler(key, Canonicalizers)(key);
}

function GetNodes(key, pushNodes) {
  return handler(key, Getters)(key, pushNodes);
}

export default GetNodes;
