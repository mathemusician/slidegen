/**
 * Normalizes a vector to unit length.
 * @param {Float32Array} vec - The vector to normalize
 * @returns {Float32Array} - The normalized vector
 */
export function normalize(vec) {
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) {
    return vec;
  }
  return Float32Array.from(vec, val => val / magnitude);
}

/**
 * Computes the cosine similarity between two vectors.
 * @param {Float32Array} a - First vector
 * @param {Float32Array} b - Second vector
 * @returns {number} - Cosine similarity score between -1 and 1
 */
export function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}
