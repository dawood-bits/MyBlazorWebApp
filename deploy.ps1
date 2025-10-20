# ============================================
# 🚀 Auto Deploy Blazor WebAssembly to GitHub Pages
# Author: ChatGPT (for dawood-bits)
# ============================================

$projectPath = "C:\Users\Administrator\Desktop\MyProjects\MyPractiseWASMStandAloneBlazorApp\MyPractiseWASMStandAloneBlazorApp"
$publishPath = "$projectPath\bin\Release\net8.0\publish\wwwroot"

Write-Host "🧩 Publishing Blazor WebAssembly App..." -ForegroundColor Cyan
dotnet publish $projectPath -c Release

Write-Host "✅ Build complete. Preparing index.html for GitHub Pages..." -ForegroundColor Green

# Fix the base href for GitHub Pages
$indexFile = Join-Path $publishPath "index.html"
(Get-Content $indexFile) -replace '<base href=".*?" />', '<base href="./" />' |
    Set-Content $indexFile -Encoding UTF8

# Duplicate index.html as 404.html
Copy-Item "$publishPath\index.html" "$publishPath\404.html" -Force

# Push to GitHub
Set-Location $publishPath
git init
git branch -M main
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin "https://github.com/dawood-bits/MyBlazorWebApp.git"

git add .
git commit -m "Auto-deploy Blazor WebAssembly to GitHub Pages"
git push -u origin main -f

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Visit: https://dawood-bits.github.io/MyBlazorWebApp/" -ForegroundColor Yellow
