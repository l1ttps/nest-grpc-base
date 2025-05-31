export default function snakeToCamelCase(str) {
  return str.replace(/([-_]\w)/g, function (matches) {
    return matches[1].toUpperCase();
  });
}

export function convertKeysToCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = key.replace(/(\_\w)/g, (match) =>
          match[1].toUpperCase(),
        );
        newObj[newKey] = convertKeysToCamelCase(obj[key]);
      }
    }

    return newObj;
  } else {
    return obj;
  }
}
