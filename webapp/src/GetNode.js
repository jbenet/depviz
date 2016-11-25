export var Canonicalizers = {};
export var Getters = {};

function handle(key, handlers) {
  const host = key.split('/', 1)[0];
  const handler = handlers[host];
  if (!handler) {
    throw new Error('unrecognized key host: ' + key);
  }
  return handler(key);
}

export function CanonicalKey(key) {
  return handle(key, Canonicalizers);
}

function GetNode(key) {
  return handle(key, Getters);
}

export default GetNode;
