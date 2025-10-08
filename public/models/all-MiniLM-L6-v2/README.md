# all-MiniLM-L6-v2 Model Files

This directory should contain the ONNX model files for local inference.

## Required Files

- `model.onnx` - The ONNX model file
- `tokenizer.json` - Tokenizer configuration (optional)
- `vocab.txt` - Vocabulary file (optional)

## Download Instructions

Download the model from Hugging Face:

**Source:** https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2

### Option 1: Download ONNX Export

Visit: https://huggingface.co/onnx-community/all-MiniLM-L6-v2

Download `model.onnx` and place it in this directory.

### Option 2: Convert Manually

```bash
# Install required packages
pip install optimum onnx onnxruntime

# Export to ONNX
optimum-cli export onnx --model sentence-transformers/all-MiniLM-L6-v2 ./onnx-export

# Copy model.onnx to this directory
cp onnx-export/model.onnx ./model.onnx
```

## Model Specifications

- **Architecture:** BERT-based sentence transformer
- **Embedding Dimension:** 384
- **Max Sequence Length:** 128 tokens
- **Size:** ~23 MB
- **License:** Apache 2.0

## Notes

- The model runs entirely in the browser using ONNX Runtime Web
- No network requests are made after the model is loaded
- First load may take a few seconds; subsequent embeddings are fast
- Embeddings are cached automatically to improve performance
