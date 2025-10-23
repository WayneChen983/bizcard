# BizCard Pro 設定指南

## 📋 前置需求
- Node.js (已安裝 ✓)
- npm (已安裝 ✓)
- Google AI (Gemini) API Key

## 🔑 取得 API Key
1. 前往 Google AI Studio：https://aistudio.google.com/app/apikey
2. 登入你的 Google 帳號
3. 點擊「Create API Key」建立新的 API Key
4. 複製產生的 API Key

## ⚙️ 設定步驟

### 1. 設定 API Key
開啟專案目錄中的 `.env.local` 檔案：
```bash
C:\Users\bl515-pub\Desktop\BizCard_Pro\bizcard\.env.local
```

將以下內容：
```
GOOGLE_API_KEY=your_api_key_here
```

替換成：
```
GOOGLE_API_KEY=你的實際_API_Key
```

💡 提示：移除 `your_api_key_here` 並貼上你的真實 API Key

### 2. 啟動開發伺服器
在終端機執行：
```powershell
cd C:\Users\bl515-pub\Desktop\BizCard_Pro\bizcard
npm run dev
```

### 3. 開啟應用程式
在瀏覽器開啟：
- **本機網址**：http://localhost:9002
- **網路網址**：http://140.112.41.102:9002 (同網域其他裝置可訪問)

## 🎯 主要功能
- ✨ AI 名片掃描（需要 API Key）
- 📇 聯絡人管理
- 🏷️ 分組分類
- 🔍 搜尋與篩選
- 🌐 多語言支援（繁中、簡中、英、日、韓等 9 種語言）

## ⚠️ 常見問題

### Q: 看到 "Missing GOOGLE_API_KEY" 錯誤？
A: 確認 `.env.local` 檔案中的 API Key 已正確填入，並重新啟動開發伺服器

### Q: 看到 "Missing script: dev" 錯誤？
A: 確認你在正確的目錄（bizcard 資料夾）執行指令

### Q: API Key 會被公開嗎？
A: 不會，`.env.local` 已在 `.gitignore` 中，不會被提交到 Git

### Q: 名片掃描功能需要網路嗎？
A: 是的，AI 掃描需要連線到 Google AI API

## 🛠️ 其他指令
```bash
# 建置生產版本
npm run build

# 執行 TypeScript 類型檢查
npm run typecheck

# 執行 ESLint 檢查
npm run lint

# Genkit AI 開發模式
npm run genkit:dev
```

## 📱 PWA 安裝
在行動裝置的瀏覽器開啟應用後，可以選擇「加入主畫面」，像原生 App 一樣使用！

---
建立日期：2025-10-23

