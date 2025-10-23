# 📇 BizCard Pro

AI 驅動的智慧名片管理應用程式  

---

## ✨ 特色功能

- 🤖 **AI 名片掃描**：使用 Google AI (Gemini) 自動識別名片資訊  
- 📱 **PWA 支援**：可安裝到手機桌面，像原生 App 一樣使用  
- 🌐 **多語言支援**：支援繁中、簡中、英、日、韓等 9 種語言  
- 🏷️ **分組管理**：輕鬆分類和管理聯絡人  
- 🔍 **智慧搜尋**：快速找到需要的聯絡人  
- 📊 **多種排序**：支援時間、字母、筆劃、注音等排序方式  
- ☁️ **雲端同步**：使用 Firebase 自動同步資料  

---

## 🚀 快速開始

### 1️⃣ 設定 Firebase Google 登入

請參閱 [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) 完整設定指南。  

**簡易步驟：**
1. 前往 [Firebase Console](https://console.firebase.google.com/)  
2. 選擇專案 → Authentication → Sign-in method  
3. 啟用 **Google** 提供者  
4. 部署 Firestore 安全規則  

---

### 2️⃣ 取得 Google AI API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)  
2. 建立並複製 API Key  

---

### 3️⃣ 設定 API Key

開啟 `.env.local` 檔案，將 `your_api_key_here` 替換成你的 API Key：  

```bash
GOOGLE_API_KEY=你的_API_Key
