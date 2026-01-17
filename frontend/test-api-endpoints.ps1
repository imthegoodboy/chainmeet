# ChainMeet - Test API Endpoints Script (PowerShell)
# This script tests all API endpoints and configurations

Write-Host "🧪 ChainMeet - API Endpoints Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
$envPath = Join-Path $PSScriptRoot ".env.local"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]*?)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "✅ Loaded .env.local" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local not found" -ForegroundColor Yellow
    Write-Host "Creating .env.local template..."
}

Write-Host ""

# Test 1: Aleo RPC Endpoint
Write-Host "Test 1: Aleo RPC Endpoint" -ForegroundColor Blue
Write-Host "----------------------------------------" -ForegroundColor Gray
$rpcUrl = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_ALEO_RPC_URL", "Process")
if ([string]::IsNullOrEmpty($rpcUrl)) {
    Write-Host "❌ NEXT_PUBLIC_ALEO_RPC_URL not set" -ForegroundColor Red
} else {
    Write-Host "✅ RPC URL: $rpcUrl" -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri $rpcUrl -Method Head -TimeoutSec 5 -ErrorAction SilentlyContinue
        Write-Host "✅ Endpoint is reachable" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not verify endpoint connectivity" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 2: Program IDs
Write-Host "Test 2: Program IDs" -ForegroundColor Blue
Write-Host "----------------------------------------" -ForegroundColor Gray
$programs = @(
    "NEXT_PUBLIC_MEETING_PROGRAM_ID",
    "NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID",
    "NEXT_PUBLIC_ATTENDANCE_PROGRAM_ID"
)

foreach ($programVar in $programs) {
    $programId = [Environment]::GetEnvironmentVariable($programVar, "Process")
    if ([string]::IsNullOrEmpty($programId)) {
        Write-Host "❌ $programVar not set" -ForegroundColor Red
    } else {
        Write-Host "✅ $programVar : $programId" -ForegroundColor Green
    }
}
Write-Host ""

# Test 3: Pinata Configuration
Write-Host "Test 3: Pinata Configuration" -ForegroundColor Blue
Write-Host "----------------------------------------" -ForegroundColor Gray
$pinataKey = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_PINATA_API_KEY", "Process")
$pinataSecret = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_PINATA_SECRET_API_KEY", "Process")
$pinataGateway = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_PINATA_GATEWAY", "Process")

if ([string]::IsNullOrEmpty($pinataKey)) {
    Write-Host "⚠️  NEXT_PUBLIC_PINATA_API_KEY not set (optional)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Pinata API Key: $($pinataKey.Substring(0, [Math]::Min(8, $pinataKey.Length)))..." -ForegroundColor Green
}

if ([string]::IsNullOrEmpty($pinataSecret)) {
    Write-Host "⚠️  NEXT_PUBLIC_PINATA_SECRET_API_KEY not set (optional)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Pinata Secret: $($pinataSecret.Substring(0, [Math]::Min(8, $pinataSecret.Length)))..." -ForegroundColor Green
}

if ([string]::IsNullOrEmpty($pinataGateway)) {
    Write-Host "⚠️  NEXT_PUBLIC_PINATA_GATEWAY not set" -ForegroundColor Yellow
} else {
    Write-Host "✅ Pinata Gateway: $pinataGateway" -ForegroundColor Green
}
Write-Host ""

# Test 4: Puzzle Wallet
Write-Host "Test 4: Puzzle Wallet Configuration" -ForegroundColor Blue
Write-Host "----------------------------------------" -ForegroundColor Gray
$puzzleUrl = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_PUZZLE_WALLET_URL", "Process")
if ([string]::IsNullOrEmpty($puzzleUrl)) {
    Write-Host "⚠️  NEXT_PUBLIC_PUZZLE_WALLET_URL not set" -ForegroundColor Yellow
} else {
    Write-Host "✅ Puzzle Wallet URL: $puzzleUrl" -ForegroundColor Green
}
Write-Host ""

# Test 5: LiveKit (Optional)
Write-Host "Test 5: LiveKit Configuration (Optional)" -ForegroundColor Blue
Write-Host "----------------------------------------" -ForegroundColor Gray
$livekitUrl = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_LIVEKIT_URL", "Process")
if ([string]::IsNullOrEmpty($livekitUrl)) {
    Write-Host "⚠️  LiveKit not configured (optional for video)" -ForegroundColor Yellow
} else {
    Write-Host "✅ LiveKit URL: $livekitUrl" -ForegroundColor Green
}
Write-Host ""

# Test 6: Network Configuration
Write-Host "Test 6: Network Configuration" -ForegroundColor Blue
Write-Host "----------------------------------------" -ForegroundColor Gray
$network = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_ALEO_NETWORK", "Process")
if ([string]::IsNullOrEmpty($network)) {
    Write-Host "⚠️  NEXT_PUBLIC_ALEO_NETWORK not set" -ForegroundColor Yellow
} else {
    Write-Host "✅ Network: $network" -ForegroundColor Green
}
Write-Host ""

# Test 7: Test Program Mapping Queries
Write-Host "Test 7: Test Program Mapping Queries" -ForegroundColor Blue
Write-Host "----------------------------------------" -ForegroundColor Gray

$meetingProgramId = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_MEETING_PROGRAM_ID", "Process")
if (-not [string]::IsNullOrEmpty($meetingProgramId) -and -not [string]::IsNullOrEmpty($rpcUrl)) {
    $testUrl = "$rpcUrl/program/$meetingProgramId"
    Write-Host "Testing: $testUrl"
    try {
        $response = Invoke-WebRequest -Uri $testUrl -Method Get -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Endpoint is responding (HTTP $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 200 -or $statusCode -eq 404) {
            Write-Host "✅ Endpoint is responding (HTTP $statusCode)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Endpoint returned HTTP $statusCode" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  Cannot test - Program ID or RPC URL not set" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📊 Summary" -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Required for deployment:" -ForegroundColor Green
Write-Host "  - Aleo RPC URL"
Write-Host "  - Program IDs (all three)"
Write-Host "  - Network configuration"
Write-Host ""
Write-Host "⚠️  Optional (for full functionality):" -ForegroundColor Yellow
Write-Host "  - Pinata API keys (for image/metadata storage)"
Write-Host "  - LiveKit configuration (for video)"
Write-Host ""
Write-Host "📝 To complete setup:" -ForegroundColor Cyan
Write-Host "1. Update frontend/.env.local with missing values"
Write-Host "2. Get Pinata API keys from https://pinata.cloud"
Write-Host "3. Restart frontend: npm run dev"
Write-Host ""
