# BizCard Pro 快速啟動腳本

Write-Host "================================" -ForegroundColor Cyan
Write-Host "   BizCard Pro 啟動檢查" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 檢查是否在正確的目錄
$currentPath = Get-Location
if ($currentPath.Path -notlike "*\bizcard") {
    Write-Host "❌ 錯誤：請在 bizcard 目錄執行此腳本" -ForegroundColor Red
    Write-Host "   執行：cd bizcard" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ 目錄位置正確" -ForegroundColor Green

# 檢查 node_modules
if (Test-Path "node_modules") {
    Write-Host "✓ 依賴套件已安裝" -ForegroundColor Green
} else {
    Write-Host "❌ 未找到 node_modules" -ForegroundColor Red
    Write-Host "   正在安裝依賴套件..." -ForegroundColor Yellow
    npm install
}

# 檢查 .env.local
if (Test-Path ".env.local") {
    Write-Host "✓ .env.local 檔案存在" -ForegroundColor Green
    
    # 檢查是否已填入 API Key
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "your_api_key_here") {
        Write-Host "⚠️  警告：API Key 尚未填入！" -ForegroundColor Yellow
        Write-Host "   請編輯 .env.local 並填入你的 Google AI API Key" -ForegroundColor Yellow
        Write-Host "   取得 API Key：https://aistudio.google.com/app/apikey" -ForegroundColor Cyan
        Write-Host ""
        
        $response = Read-Host "是否要現在開啟 .env.local 編輯？(Y/n)"
        if ($response -eq "" -or $response -eq "Y" -or $response -eq "y") {
            notepad .env.local
            Write-Host ""
            Write-Host "請在記事本中填入你的 API Key，儲存後按任意鍵繼續..." -ForegroundColor Yellow
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
    } else {
        Write-Host "✓ API Key 已設定" -ForegroundColor Green
    }
} else {
    Write-Host "❌ 未找到 .env.local 檔案" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "   正在啟動開發伺服器..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "伺服器啟動後，請在瀏覽器開啟：" -ForegroundColor Green
Write-Host "  → http://localhost:9002" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止伺服器" -ForegroundColor Yellow
Write-Host ""

# 啟動開發伺服器
npm run dev

