# 🧠 AI Content Extractor

This is a Node.js + Express backend that extracts readable content from a public URL and generates an AI-powered summary and key points using HuggingFace's BART summarization model.

### 🌐 Live API URL

> https://content-extract-ui.vercel.app

---

## 🚀 Features

- Extracts clean text content from any public webpage
- Summarizes the content using HuggingFace (facebook/bart-large-cnn)
- Generates unique key points (not just repeating the summary)
- CORS-enabled for frontend integration
- Simple REST API

---

## 📦 Tech Stack

- Node.js + Express
- HuggingFace Inference API
- `html-to-text` for content extraction
- Axios, dotenv, CORS

---

## 🔧 Setup & Run Locally

1. Clone the backend repo:
```bash
git clone  git clone https://github.com/dk0016/content-extract-be.git
cd content-extractor-backend
npm install
npm start
