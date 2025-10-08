/**
 * AI Model Module - Local sentence embedding using ONNX Runtime Web
 * Uses all-MiniLM-L6-v2 model for text embeddings
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

let ort = null;
let session = null;
let isLoading = false;
let loadError = null;

// Cache for embeddings to avoid recomputation
const embeddingCache = new Map();

// Model configuration
// Detect environment and set appropriate path
const isBrowser = typeof window !== 'undefined';
let MODEL_PATH;

if (isBrowser) {
  // Browser: use public path
  MODEL_PATH = '/models/all-MiniLM-L6-v2/model.onnx';
} else {
  // Node.js: use file system path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  MODEL_PATH = join(__dirname, '../../public/models/all-MiniLM-L6-v2/model.onnx');
}

const EMBEDDING_DIM = 384; // all-MiniLM-L6-v2 output dimension
const MAX_SEQUENCE_LENGTH = 128;

/**
 * Loads the ONNX Runtime and initializes the model session.
 * This is called lazily on first embedText() invocation.
 */
async function loadModel() {
  if (session) return session;
  if (isLoading) {
    // Wait for ongoing load
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return session;
  }

  isLoading = true;
  console.info('Loading MiniLM model...');

  try {
    // Dynamic import - use appropriate runtime for environment
    if (!ort) {
      if (isBrowser) {
        // Browser: use onnxruntime-web with WASM
        ort = await import('onnxruntime-web');
        ort.env.wasm.numThreads = 1;
        ort.env.wasm.simd = true;
        ort.env.wasm.wasmPaths = '/';
      } else {
        // Node.js: use onnxruntime-node (native, faster)
        ort = await import('onnxruntime-node');
      }
    }

    // Load the model
    const executionProviders = isBrowser ? ['wasm'] : ['cpu'];
    session = await ort.InferenceSession.create(MODEL_PATH, {
      executionProviders,
    });

    console.info('MiniLM model loaded successfully');
    isLoading = false;
    return session;
  } catch (error) {
    isLoading = false;
    loadError = error;
    console.warn('Failed to load MiniLM model:', error.message);
    console.warn('Make sure model files exist at:', MODEL_PATH);
    throw new Error(`Model loading failed: ${error.message}`);
  }
}

/**
 * Simple tokenizer for all-MiniLM-L6-v2
 * This is a basic implementation. For production, use proper BERT tokenizer.
 * @param {string} text - Text to tokenize
 * @returns {Object} - Token IDs and attention mask
 */
function tokenize(text) {
  // Normalize text
  const normalized = text.toLowerCase().trim();
  
  // Simple word-based tokenization (placeholder)
  // In production, this should use proper BERT tokenization with vocab.txt
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  
  // Create token IDs (simplified - just use character codes as proxy)
  // This is a placeholder until proper tokenizer is integrated
  const tokens = [];
  const CLS_TOKEN = 101;
  const SEP_TOKEN = 102;
  const PAD_TOKEN = 0;
  
  tokens.push(CLS_TOKEN);
  
  for (const word of words) {
    if (tokens.length >= MAX_SEQUENCE_LENGTH - 1) break;
    // Simple hash of word to token ID (constrained to valid vocab range)
    // Vocab size is 30522, reserve first 1000 for special tokens
    const VOCAB_SIZE = 30522;
    const MIN_TOKEN_ID = 999;
    const MAX_TOKEN_ID = VOCAB_SIZE - 1;
    
    const hash = Math.abs(word.split('').reduce((h, char) => {
      return ((h << 5) - h) + char.charCodeAt(0);
    }, 0));
    const tokenId = MIN_TOKEN_ID + (hash % (MAX_TOKEN_ID - MIN_TOKEN_ID + 1));
    tokens.push(tokenId);
  }
  
  tokens.push(SEP_TOKEN);
  
  // Pad to MAX_SEQUENCE_LENGTH
  const attentionMask = new Array(tokens.length).fill(1);
  const tokenTypeIds = new Array(tokens.length).fill(0); // All 0s for single sentence
  
  while (tokens.length < MAX_SEQUENCE_LENGTH) {
    tokens.push(PAD_TOKEN);
    attentionMask.push(0);
    tokenTypeIds.push(0);
  }
  
  return {
    input_ids: new BigInt64Array(tokens.map(t => BigInt(t))),
    attention_mask: new BigInt64Array(attentionMask.map(m => BigInt(m))),
    token_type_ids: new BigInt64Array(tokenTypeIds.map(t => BigInt(t))),
  };
}

/**
 * Mean pooling operation on model output
 * @param {Float32Array} lastHiddenState - Model output
 * @param {BigInt64Array} attentionMask - Attention mask
 * @returns {Float32Array} - Pooled embedding
 */
function meanPooling(lastHiddenState, attentionMask) {
  const seqLength = MAX_SEQUENCE_LENGTH;
  const embedding = new Float32Array(EMBEDDING_DIM);
  
  let sumMask = 0;
  for (let i = 0; i < seqLength; i++) {
    const maskValue = Number(attentionMask[i]);
    sumMask += maskValue;
    
    for (let j = 0; j < EMBEDDING_DIM; j++) {
      embedding[j] += lastHiddenState[i * EMBEDDING_DIM + j] * maskValue;
    }
  }
  
  // Normalize by sum of attention mask
  if (sumMask > 0) {
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      embedding[i] /= sumMask;
    }
  }
  
  return embedding;
}

/**
 * Generates a sentence embedding for the given text.
 * Results are cached to avoid recomputation.
 * 
 * @param {string} text - The text to embed
 * @returns {Promise<Float32Array>} - The embedding vector (384 dimensions)
 * @throws {Error} - If model fails to load or inference fails
 */
export async function embedText(text) {
  // Check cache first
  const cacheKey = text.trim().toLowerCase();
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey);
  }

  // Ensure model is loaded
  const modelSession = await loadModel();

  // Tokenize input
  const { input_ids, attention_mask, token_type_ids } = tokenize(text);

  // Create tensors
  const inputIdsTensor = new ort.Tensor('int64', input_ids, [1, MAX_SEQUENCE_LENGTH]);
  const attentionMaskTensor = new ort.Tensor('int64', attention_mask, [1, MAX_SEQUENCE_LENGTH]);
  const tokenTypeIdsTensor = new ort.Tensor('int64', token_type_ids, [1, MAX_SEQUENCE_LENGTH]);

  // Run inference
  const feeds = {
    input_ids: inputIdsTensor,
    attention_mask: attentionMaskTensor,
    token_type_ids: tokenTypeIdsTensor,
  };

  const results = await modelSession.run(feeds);
  
  // Get the last hidden state output
  const outputTensor = results.last_hidden_state || results.logits || Object.values(results)[0];
  const outputData = outputTensor.data;

  // Apply mean pooling
  const embedding = meanPooling(outputData, attention_mask);

  // Normalize the embedding
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  const normalizedEmbedding = Float32Array.from(embedding, val => val / (magnitude || 1));

  // Cache the result
  embeddingCache.set(cacheKey, normalizedEmbedding);

  return normalizedEmbedding;
}

/**
 * Clears the embedding cache
 */
export function clearCache() {
  embeddingCache.clear();
}

/**
 * Gets cache statistics
 * @returns {Object} - Cache size and keys
 */
export function getCacheStats() {
  return {
    size: embeddingCache.size,
    keys: Array.from(embeddingCache.keys()),
  };
}

/**
 * Checks if the model is loaded
 * @returns {boolean}
 */
export function isModelLoaded() {
  return session !== null;
}

/**
 * Gets the last load error if any
 * @returns {Error|null}
 */
export function getLoadError() {
  return loadError;
}
