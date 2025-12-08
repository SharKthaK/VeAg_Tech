# VeAg Project - Quick Installation Script
# Run this script to install all dependencies

Write-Host "=====================================" -ForegroundColor Green
Write-Host "VeAg Project Installation" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Install server dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Cyan
Set-Location -Path "server"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Server dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install server dependencies" -ForegroundColor Red
    exit 1
}
Set-Location -Path ".."

Write-Host ""

# Install client dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Cyan
Set-Location -Path "client"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Client dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install client dependencies" -ForegroundColor Red
    exit 1
}
Set-Location -Path ".."

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure Firebase (see SETUP.md)" -ForegroundColor White
Write-Host "2. Create .env files in both client and server folders" -ForegroundColor White
Write-Host "3. Setup MongoDB (local or Atlas)" -ForegroundColor White
Write-Host "4. Run 'npm run dev' in both server and client folders" -ForegroundColor White
Write-Host ""
Write-Host "See SETUP.md for detailed instructions" -ForegroundColor Cyan
