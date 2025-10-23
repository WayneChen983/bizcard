# 🔥 手動部署 Firestore 安全規則

## ❗ 重要：解決權限錯誤

你遇到的 `Missing or insufficient permissions` 錯誤是因為 Firestore 安全規則還沒有更新到 Firebase 伺服器。

## 📝 手動部署步驟（簡單快速）

### 步驟 1：打開 Firebase Console

1. 前往：https://console.firebase.google.com/
2. 選擇專案：**studio-1552242347-abca1**

### 步驟 2：進入 Firestore 規則設定

1. 在左側選單點擊 **Firestore Database**
2. 點擊上方的 **Rules**（規則）標籤

### 步驟 3：複製並貼上新規則

將以下規則**完整複製**並**貼上**到規則編輯器中（**取代所有現有規則**）：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允許用戶讀寫自己的資料
    // 支援 Google 登入和匿名登入
    match /users/{userId}/{document=**} {
      // 確認用戶已登入且 UID 匹配
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 步驟 4：發布規則

1. 檢查規則語法（Firebase 會自動驗證）
2. 點擊 **Publish**（發布）按鈕
3. 等待幾秒鐘讓規則生效

### 步驟 5：測試

1. 回到你的應用程式：http://localhost:9002
2. 重新整理頁面
3. 使用 Google 登入
4. 掃描名片
5. ✅ 應該可以成功儲存了！

---

## 🎯 規則說明

這個規則的作用：

```javascript
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

- `match /users/{userId}/{document=**}` - 匹配用戶資料路徑
- `request.auth != null` - 確認用戶已登入
- `request.auth.uid == userId` - 確認用戶只能訪問自己的資料
- `{document=**}` - 包含所有子集合（如 contacts、groups）

---

## 📸 視覺化步驟截圖提示

### 步驟 2 畫面：
```
Firebase Console
├── Firestore Database (左側選單)
    ├── Data (資料)
    └── Rules (規則) ← 點這個
```

### 步驟 3 畫面：
```
┌─────────────────────────────────────┐
│ Firestore Rules Editor              │
├─────────────────────────────────────┤
│ rules_version = '2';                │
│ service cloud.firestore {           │
│   match /databases/{database}/...   │  ← 在這裡貼上新規則
│ }                                   │
└─────────────────────────────────────┘
         [Publish] 按鈕
```

---

## ⚡ 快速檢查清單

部署前：
- [ ] 已在 Firebase Console
- [ ] 已選擇正確專案（studio-1552242347-abca1）
- [ ] 已進入 Firestore Database → Rules

部署：
- [ ] 已複製上面的規則
- [ ] 已貼上到編輯器（取代所有內容）
- [ ] 已點擊 Publish
- [ ] 已看到成功訊息

測試：
- [ ] 重新整理應用程式
- [ ] 使用 Google 登入
- [ ] 掃描名片
- [ ] 成功儲存聯絡人

---

## 🐛 如果還是不行

### 檢查 1：確認規則已發布
- 在 Firebase Console 的 Rules 頁面
- 檢查是否有 "Last published" 時間戳記
- 時間應該是剛剛

### 檢查 2：清除瀏覽器快取
- 按 Ctrl + Shift + Delete
- 清除快取和 Cookie
- 重新登入

### 檢查 3：檢查登入狀態
在應用程式中按 F12 打開開發者工具，執行：
```javascript
firebase.auth().currentUser
```
應該看到你的用戶資訊

### 檢查 4：等待幾分鐘
有時規則需要 1-2 分鐘才會完全生效

---

## 💡 為什麼需要這個規則？

你的應用程式資料結構：
```
/users/{userId}/contacts/{contactId}
```

沒有規則的話，Firebase 預設會**拒絕所有請求**。
這個規則讓已登入用戶可以：
- ✅ 讀取自己的聯絡人
- ✅ 新增自己的聯絡人
- ✅ 編輯自己的聯絡人
- ✅ 刪除自己的聯絡人
- ❌ 無法訪問其他人的資料（安全）

---

## 🎉 完成後

規則部署成功後，你就可以：
- 掃描名片 ✅
- 儲存聯絡人 ✅
- 編輯聯絡人 ✅
- 刪除聯絡人 ✅
- 資料同步到雲端 ✅
- 跨裝置訪問 ✅

**不再會看到權限錯誤！** 🎊

---

建立日期：2025-10-23

