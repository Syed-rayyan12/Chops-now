# Test Jobs and Applications API
$baseUrl = "https://nodejs-production-c43f.up.railway.app/api"

Write-Host "🔍 Testing Jobs API..." -ForegroundColor Cyan

# Test 1: GET all jobs
Write-Host "`n1️⃣ Testing GET /api/jobs" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/jobs" -Method Get
    Write-Host "✅ GET /api/jobs - SUCCESS" -ForegroundColor Green
    Write-Host "Jobs Count: $($response.jobs.Count)" -ForegroundColor White
} catch {
    Write-Host "❌ GET /api/jobs - FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: POST create job
Write-Host "`n2️⃣ Testing POST /api/jobs" -ForegroundColor Yellow
$jobData = @{
    title = "Test Job - Backend Developer"
    department = "Corporate"
    jobType = "Full-time"
    location = "Remote"
    salaryRange = "£40,000 - £60,000"
    description = "We are looking for a skilled backend developer to join our team."
    requirements = "- 3+ years of Node.js experience`n- Experience with PostgreSQL`n- Knowledge of REST APIs"
    responsibilities = "- Develop and maintain backend services`n- Write clean, maintainable code`n- Collaborate with frontend team"
    status = "active"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/jobs" -Method Post -Body $jobData -ContentType "application/json"
    Write-Host "✅ POST /api/jobs - SUCCESS" -ForegroundColor Green
    Write-Host "Job Created: $($response.job.title)" -ForegroundColor White
    Write-Host "Job ID: $($response.job.id)" -ForegroundColor White
    $jobId = $response.job.id
} catch {
    Write-Host "❌ POST /api/jobs - FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: GET all applications
Write-Host "`n3️⃣ Testing GET /api/applications" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/applications" -Method Get
    Write-Host "✅ GET /api/applications - SUCCESS" -ForegroundColor Green
    Write-Host "Applications Count: $($response.applications.Count)" -ForegroundColor White
} catch {
    Write-Host "❌ GET /api/applications - FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ All Tests Complete!" -ForegroundColor Cyan
Write-Host "If any tests failed, wait 1 more minute for Railway to finish deploying." -ForegroundColor Yellow
