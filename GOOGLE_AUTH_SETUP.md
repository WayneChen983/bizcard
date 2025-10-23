# Google 登入設定指南

## 📋 概述
BizCard Pro 現在支援 Google 登入功能！這可以解決 Firebase 權限問題，並提供更好的使用者體驗。

## 🔧 Firebase Console 設定步驟

### 1. 啟用 Google 登入提供者

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的專案：`studio-1552242347-abca1`
3. 點擊左側選單的 **Authentication**（身份驗證）
4. 點擊 **Sign-in method**（登入方法）標籤
5. 找到 **Google** 提供者，點擊編輯
6. 啟用 **Enable**（啟用）開關
7. 填入專案支援電子郵件（任何你的 Gmail 地址即可）
8. 點擊 **Save**（儲存）

### 2. 設定授權網域（可選）

如果需要在特定網域使用：
1. 在 Authentication 頁面，點擊 **Settings** 標籤
2. 在 **Authorized domains**（授權網域）區段
3. 添加你的網域（localhost 預設已包含）

### 3. 檢查 Firestore 安全規則

確認 Firestore 規則允許已驗證用戶訪問：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      // 允許已驗證用戶（包含 Google 登入和匿名）訪問自己的資料
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**部署規則**：
```bash
cd C:\Users\bl515-pub\Desktop\BizCard_Pro\bizcard
firebase deploy --only firestore:rules
```

如果沒有安裝 Firebase CLI：
```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # 選擇現有專案
firebase deploy --only firestore:rules
```

## ✨ 新功能說明

### 登入頁面
- **路徑**：`/login`
- **功能**：
  - Google 一鍵登入
  - 訪客模式（匿名登入）
  - 自動重定向已登入用戶

### 設定頁面增強
- 顯示用戶頭像和資訊
- Google 用戶顯示名稱和照片
- 訪客模式標記
- 登出按鈕

### 自動導向
- 未登入用戶訪問任何頁面 → 自動跳轉到登入頁
- 已登入用戶訪問登入頁 → 自動跳轉到首頁

## 🎯 使用流程

### 用戶體驗流程

1. **首次訪問**
   - 進入網站自動跳轉到 `/login`
   - 選擇 Google 登入或訪客模式

2. **Google 登入**
   - 點擊「使用 Google 登入」
   - Google OAuth 彈窗出現
   - 選擇 Google 帳號
   - 授權後自動登入並跳轉到首頁

3. **訪客模式**
   - 點擊「以訪客身份繼續」
   - 自動建立匿名帳號
   - 跳轉到首頁

4. **登出**
   - 進入設定頁面
   - 點擊底部「登出」按鈕
   - 自動跳轉回登入頁

## 🔒 權限說明

### Google 登入用戶
- ✅ 完整的讀寫權限
- ✅ 資料與 Google 帳號綁定
- ✅ 跨裝置同步
- ✅ 不會遺失資料

### 訪客用戶
- ✅ 完整的讀寫權限
- ⚠️ 資料儲存在本機瀏覽器
- ⚠️ 清除瀏覽器資料會遺失
- ⚠️ 無法跨裝置同步

## 🐛 常見問題

### Q1: Google 登入彈窗被封鎖？
**A**: 允許瀏覽器彈窗，或檢查瀏覽器設定

### Q2: 出現「Unauthorized domain」錯誤？
**A**: 在 Firebase Console → Authentication → Settings → Authorized domains 新增你的網域

### Q3: 登入後仍然看到權限錯誤？
**A**: 
1. 檢查 Firestore 規則是否正確
2. 確認規則已部署：`firebase deploy --only firestore:rules`
3. 等待幾分鐘讓規則生效

### Q4: 想從訪客模式升級到 Google 帳號？
**A**: 目前需要：
1. 登出訪客模式
2. 使用 Google 登入
3. 訪客資料會保留在本機（未來可新增資料遷移功能）

### Q5: 如何部署 Firestore 規則？
**A**: 
```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入
firebase login

# 初始化專案
firebase init firestore

# 部署規則
firebase deploy --only firestore:rules
```

## 📱 測試清單

### 本機測試
- [ ] Google 登入成功
- [ ] 訪客登入成功
- [ ] 登入後可新增聯絡人
- [ ] 登入後可編輯聯絡人
- [ ] 登入後可刪除聯絡人
- [ ] AI 掃描名片功能正常
- [ ] 登出功能正常
- [ ] 未登入自動跳轉到登入頁
- [ ] 已登入訪問登入頁自動跳轉首頁

### 行動裝置測試
- [ ] 手機瀏覽器 Google 登入
- [ ] 平板瀏覽器 Google 登入
- [ ] PWA 安裝後登入狀態保持

## 🚀 快速測試指令

```bash
# 1. 確保在正確目錄
cd C:\Users\bl515-pub\Desktop\BizCard_Pro\bizcard

# 2. 確認環境變數已設定（API Key）
# 檢查 .env.local 檔案中的 GOOGLE_API_KEY

# 3. 啟動開發伺服器
npm run dev

# 4. 在瀏覽器開啟
# http://localhost:9002/login

# 5. 測試 Google 登入和訪客登入
```

## 📊 功能對照表

| 功能 | Google 登入 | 訪客模式 |
|-----|-----------|---------|
| 掃描名片 | ✅ | ✅ |
| 新增聯絡人 | ✅ | ✅ |
| 編輯聯絡人 | ✅ | ✅ |
| 刪除聯絡人 | ✅ | ✅ |
| 雲端同步 | ✅ | ❌ |
| 跨裝置訪問 | ✅ | ❌ |
| 資料持久化 | ✅ | ⚠️（依賴瀏覽器） |
| 個人頭像 | ✅ | ❌ |
| 顯示名稱 | ✅ | ❌ |

## 🎨 UI 組件

### 登入頁面組件
- `src/app/login/page.tsx` - 主登入頁面
- Google 登入按鈕（含 Google Logo）
- 訪客登入按鈕
- Loading 狀態顯示
- 錯誤處理

### 設定頁面組件
- 用戶資訊卡片（頭像、名稱、Email）
- 訪客模式標記
- 登出按鈕

### 多語言支援
- 登入相關文字已加入繁中和英文翻譯
- 可在 `src/lib/locales/` 添加更多語言

## 🔐 安全性注意事項

1. **Firestore 規則**：確保規則限制用戶只能訪問自己的資料
2. **API Key**：Google AI API Key 儲存在 `.env.local`（不會被提交）
3. **OAuth 憑證**：由 Firebase 自動管理
4. **HTTPS**：生產環境務必使用 HTTPS

---

建立日期：2025-10-23
版本：1.0.0

