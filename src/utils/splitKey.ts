const splitKey = (key: string) => {
  if (key.includes(':')) {
    const [contextKey, pieceKey] = key.split(':');

    return [contextKey || 'root', pieceKey];
  }

  return ['root', key];
};

export default splitKey;
