/**
 * Unit tests for AI model module
 * Run with: node --test src/ai/model.test.js
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert';

// Mock environment for testing
if (typeof globalThis.fetch === 'undefined') {
  // Polyfill fetch for Node.js environment if needed
  globalThis.fetch = async () => {
    throw new Error('Model file not found - this is expected in test environment');
  };
}

describe('AI Model Module', () => {
  describe('embedText', () => {
    it('should be importable', async () => {
      const { embedText } = await import('./model.js');
      assert.strictEqual(typeof embedText, 'function', 'embedText should be a function');
    });

    it('should throw error when model file is missing', async () => {
      const { embedText } = await import('./model.js');
      
      try {
        await embedText('test text');
        assert.fail('Should have thrown an error when model is missing');
      } catch (error) {
        assert.ok(error.message.includes('Model loading failed'), 'Should indicate model loading failure');
      }
    });

    it('should return Float32Array when model is available', async () => {
      // This test requires the actual model file to be present
      // Skip if model is not available
      const { embedText, getLoadError } = await import('./model.js');
      
      // Check if we can load the model
      try {
        const embedding = await embedText('Hello world');
        
        // Verify it's a Float32Array
        assert.ok(embedding instanceof Float32Array, 'Should return Float32Array');
        
        // Verify consistent length (384 for all-MiniLM-L6-v2)
        assert.strictEqual(embedding.length, 384, 'Should return 384-dimensional embedding');
        
        // Verify it's normalized (magnitude close to 1)
        const magnitude = Math.sqrt(
          Array.from(embedding).reduce((sum, val) => sum + val * val, 0)
        );
        assert.ok(Math.abs(magnitude - 1) < 0.01, 'Embedding should be normalized');
        
      } catch (error) {
        if (error.message.includes('Model loading failed')) {
          console.log('⚠️  Skipping test - model file not present at /models/all-MiniLM-L6-v2/model.onnx');
          console.log('   This is expected if model files have not been downloaded yet.');
        } else {
          throw error;
        }
      }
    });

    it('should cache embeddings for repeated text', async () => {
      const { embedText, getCacheStats, clearCache } = await import('./model.js');
      
      // Clear cache first
      clearCache();
      
      const initialStats = getCacheStats();
      assert.strictEqual(initialStats.size, 0, 'Cache should be empty initially');
      
      try {
        // Generate embedding twice
        const text = 'Test caching';
        const embedding1 = await embedText(text);
        const embedding2 = await embedText(text);
        
        // Should return the same object from cache
        assert.strictEqual(embedding1, embedding2, 'Should return cached embedding');
        
        const finalStats = getCacheStats();
        assert.strictEqual(finalStats.size, 1, 'Cache should contain one entry');
        
      } catch (error) {
        if (error.message.includes('Model loading failed')) {
          console.log('⚠️  Skipping caching test - model file not present');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Cache utilities', () => {
    it('should clear cache', async () => {
      const { getCacheStats, clearCache } = await import('./model.js');
      
      clearCache();
      const stats = getCacheStats();
      
      assert.strictEqual(stats.size, 0, 'Cache should be empty after clearing');
      assert.strictEqual(stats.keys.length, 0, 'Should have no keys');
    });

    it('should report cache statistics', async () => {
      const { getCacheStats } = await import('./model.js');
      
      const stats = getCacheStats();
      
      assert.ok(typeof stats.size === 'number', 'Should have size property');
      assert.ok(Array.isArray(stats.keys), 'Should have keys array');
    });
  });

  describe('Model status', () => {
    it('should report model load status', async () => {
      const { isModelLoaded } = await import('./model.js');
      
      const loaded = isModelLoaded();
      assert.ok(typeof loaded === 'boolean', 'Should return boolean');
    });

    it('should report load errors', async () => {
      const { getLoadError } = await import('./model.js');
      
      const error = getLoadError();
      // Error can be null or Error object
      assert.ok(error === null || error instanceof Error, 'Should return null or Error');
    });
  });
});

describe('Cosine similarity utilities', () => {
  it('should calculate cosine similarity correctly', async () => {
    const { cosineSimilarity } = await import('./cosine.js');
    
    const vec1 = new Float32Array([1, 0, 0]);
    const vec2 = new Float32Array([1, 0, 0]);
    
    const similarity = cosineSimilarity(vec1, vec2);
    assert.strictEqual(similarity, 1, 'Identical vectors should have similarity of 1');
  });

  it('should normalize vectors correctly', async () => {
    const { normalize } = await import('./cosine.js');
    
    const vec = new Float32Array([3, 4, 0]);
    const normalized = normalize(vec);
    
    const magnitude = Math.sqrt(
      Array.from(normalized).reduce((sum, val) => sum + val * val, 0)
    );
    
    assert.ok(Math.abs(magnitude - 1) < 0.0001, 'Normalized vector should have magnitude 1');
  });

  it('should throw error for vectors of different lengths', async () => {
    const { cosineSimilarity } = await import('./cosine.js');
    
    const vec1 = new Float32Array([1, 2, 3]);
    const vec2 = new Float32Array([1, 2]);
    
    assert.throws(
      () => cosineSimilarity(vec1, vec2),
      /Vectors must have the same length/,
      'Should throw error for mismatched vector lengths'
    );
  });
});
