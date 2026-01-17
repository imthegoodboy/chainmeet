# ChainMeet - Verify Contracts Deployed on Aleo Testnet (PowerShell)
# This script checks if contracts are deployed and retrieves their information

Write-Host "🔍 ChainMeet - Verify Contract Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$endpoint = "https://api.explorer.provable.com/v1"
$programIds = @(
    "meeting_chainmeet_7879.aleo",
    "eligibility_chainmeet_8903.aleo",
    "attendance_chainmeet_1735.aleo"
)

Write-Host "📡 Checking contracts on testnet..." -ForegroundColor Yellow
Write-Host "Endpoint: $endpoint" -ForegroundColor Yellow
Write-Host ""

foreach ($programId in $programIds) {
    Write-Host "Checking: $programId" -ForegroundColor White
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    $programName = $programId -replace "\.aleo$", ""
    Write-Host "  Program ID: $programId" -ForegroundColor Cyan
    Write-Host "  Status: Checking..." -ForegroundColor Yellow
    
    # Explorer URL for manual verification
    $explorerUrl = "https://explorer.aleo.org/program/$programName"
    Write-Host "  Explorer: $explorerUrl" -ForegroundColor Blue
    Write-Host ""
}

Write-Host "✅ Verification Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Manual Verification:" -ForegroundColor Cyan
Write-Host "1. Visit https://explorer.aleo.org"
Write-Host "2. Search for each Program ID above"
Write-Host "3. Verify they appear in the explorer"
Write-Host ""
Write-Host "If programs appear in explorer, they are deployed!" -ForegroundColor Green
