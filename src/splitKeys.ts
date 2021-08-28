const splitKeys = (key: string) => {
  if (key.includes(':')) {
    const [contextKey, pieceKey] = key.split(':');

    return [contextKey ? `_${contextKey}` : 'root', pieceKey];
  }

  return ['root', key];
};

export default splitKeys;
