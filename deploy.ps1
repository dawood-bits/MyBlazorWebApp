# ======================================================
# 🚀 Auto Deploy Blazor WebAssembly to GitHub Pages
# Author: ChatGPT for dawood-bits
# ======================================================

$projectPath = "C:\Users\Administrator\Desktop\MyProjects\MyPractiseWASMStandAloneBlazorApp\MyPractiseWASMStandAloneBlazorApp"
$publishPath = "$projectPath\bin\Release\net8.0\publish\wwwroot"
$repoUrl = "https://github.com/dawood-bits/MyBlazorWebApp.git"
$liveUrl = "https://dawood-bits.github.io/MyBlazorWebApp/"

Write-Host "🧩 Step 1: Publishing Blazor WebAssembly App..." -ForegroundColor Cyan
dotnet publish $projectPath -c Release

if (-Not (Test-Path $publishPath)) {
    Write-Host "❌ Publish folder not found. Check project path." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Step 2: Build complete. Adjusting index.html for GitHub Pages..." -ForegroundColor Green

# Fix <base href> to use relative path
$indexFile = Join-Path $publishPath "index.html"
(Get-Content $indexFile) -replace '<base href=".*?" />', '<base href="./" />' |
    Set-Content $indexFile -Encoding UTF8

# Duplicate index.html as 404.html
Copy-Item "$publishPath\index.html" "$publishPath\404.html" -Force

# Move to publish directory
Set-Location $publishPath

# Initialize or reset Git
if (-Not (Test-Path ".git")) {
    git init
}
git branch -M main
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin $repoUrl

# Commit and push
Write-Host "📦 Step 3: Committing and pushing to GitHub..." -ForegroundColor Cyan
git add .
git commit -m "Auto-deploy Blazor WebAssembly to GitHub Pages" | Out-Null
git push -u origin main -f

# Open live site automatically
Write-Host "🌐 Step 4: Opening live site..." -ForegroundColor Yellow
Start-Process $liveUrl

Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
Write-Host "✅ Live at: $liveUrl"
