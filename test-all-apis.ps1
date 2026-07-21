$BASE = "http://localhost:4000"
$global:pass = 0
$global:fail = 0

function Test-API {
    param($method, $url, $body, $token, $name)
    try {
        $headers = @{}
        if ($token) { $headers["Authorization"] = "Bearer $token" }
        $params = @{ Method=$method; Uri="$BASE$url"; Headers=$headers; ErrorAction="Stop" }
        if ($body) { $params["ContentType"]="application/json"; $params["Body"]=($body|ConvertTo-Json) }
        $res = Invoke-RestMethod @params
        Write-Host "  PASS  $name" -ForegroundColor Green
        $global:pass++
        return $res
    } catch {
        $errMsg = ""
        try { $errMsg = ($_.ErrorDetails.Message | ConvertFrom-Json).message } catch {}
        if (-not $errMsg) { $errMsg = $_.Exception.Message }
        Write-Host "  FAIL  $name - $errMsg" -ForegroundColor Red
        $global:fail++
        return $null
    }
}

Write-Host "`n====== AUTH APIs ======" -ForegroundColor Yellow

$reg = Test-API "POST" "/api/auth/register" @{username="testuser99";email="testuser99@test.com";password="Test123!";role="admin"} $null "Register"
$TOKEN = $reg.accessToken

Test-API "POST" "/api/auth/login" @{email="testuser99@test.com";password="Test123!"} $null "Login (sends OTP)"
Write-Host "  SKIP  Verify OTP (needs real email OTP)" -ForegroundColor DarkYellow
Test-API "GET" "/api/auth/me" $null $TOKEN "Get Me"
Test-API "GET" "/api/auth/sessions" $null $TOKEN "Get Sessions"

$fp = Test-API "POST" "/api/auth/forgot-password" @{email="testuser99@test.com"} $null "Forgot Password"
if ($fp -and $fp.token) {
    Test-API "POST" "/api/auth/reset-password" @{token=$fp.token;newPassword="NewTest123!"} $null "Reset Password"
} else {
    Write-Host "  SKIP  Reset Password" -ForegroundColor DarkYellow
}

Test-API "PUT" "/api/auth/profile" @{username="testuser99updated"} $TOKEN "Update Profile"
Test-API "GET" "/api/auth/admin" $null $TOKEN "Admin Route"
Test-API "POST" "/api/auth/logout-all" $null $TOKEN "Logout All"

$reg2 = Test-API "POST" "/api/auth/register" @{username="admintest100";email="admintest100@test.com";password="Admin123!";role="admin"} $null "Register Admin2"
$TOKEN = $reg2.accessToken

Write-Host "`n====== EMPLOYEE APIs ======" -ForegroundColor Yellow

$emp = Test-API "POST" "/api/employees/createEmpoyee" @{
    employeeId="EMPTEST100"; fullName="Test Employee"; email="emptest100@company.com"
    phone="9876543210"; department="IT"; designation="Developer"
    salary=50000; joiningDate="2024-01-01"
} $TOKEN "Create Employee"
$EMP_ID = if ($emp) { $emp.employee._id } else { $null }

Test-API "GET" "/api/employees/get" $null $TOKEN "Get All Employees"
if ($EMP_ID) { Test-API "GET" "/api/employees/$EMP_ID" $null $TOKEN "Get Employee by ID" }
if ($EMP_ID) { Test-API "PUT" "/api/employees/$EMP_ID" @{fullName="Updated Employee";salary=60000} $TOKEN "Update Employee" }

Write-Host "`n====== ATTENDANCE APIs ======" -ForegroundColor Yellow

$att = if ($EMP_ID) { Test-API "POST" "/api/attendance/check-in" @{employee=$EMP_ID} $TOKEN "Check In" } else { $null }
$ATT_ID = if ($att) { $att.attendance._id } else { $null }

if ($ATT_ID) { Test-API "PUT" "/api/attendance/check-out/$ATT_ID" @{remarks="On time"} $TOKEN "Check Out" }
Test-API "GET" "/api/attendance/get" $null $TOKEN "Get All Attendance"
Test-API "GET" "/api/attendance/monthly-report?month=7`&year=2026" $null $TOKEN "Monthly Attendance Report"
if ($EMP_ID) { Test-API "GET" "/api/attendance/$EMP_ID" $null $TOKEN "Get Attendance by Employee" }

Write-Host "`n====== LEAVE APIs ======" -ForegroundColor Yellow

$leave = if ($EMP_ID) {
    Test-API "POST" "/api/leave/apply" @{
        employee=$EMP_ID; leaveType="Casual"
        startDate="2026-08-01"; endDate="2026-08-03"
        totalDays=3; reason="Personal work"
    } $TOKEN "Apply Leave"
} else { $null }
$LEAVE_ID = if ($leave) { $leave.leave._id } else { $null }

Test-API "GET" "/api/leave/" $null $TOKEN "Get All Leaves"
if ($LEAVE_ID) { Test-API "GET" "/api/leave/$LEAVE_ID" $null $TOKEN "Get Leave by ID" }
if ($LEAVE_ID) { Test-API "PUT" "/api/leave/$LEAVE_ID" @{reason="Updated reason"} $TOKEN "Update Leave" }
if ($LEAVE_ID) { Test-API "PUT" "/api/leave/approve/$LEAVE_ID" @{remarks="Approved"} $TOKEN "Approve Leave" }

Write-Host "`n====== PAYROLL APIs ======" -ForegroundColor Yellow

$payroll = if ($EMP_ID) {
    Test-API "POST" "/api/payroll/generate" @{
        employee=$EMP_ID; basicSalary=50000
        workingDays=26; presentDays=24; leaveDays=2
        overtimeHours=0; bonus=5000; deduction=2000
        month=7; year=2026
    } $TOKEN "Generate Payroll"
} else { $null }
$PAY_ID = if ($payroll) { $payroll.payroll._id } else { $null }

Test-API "GET" "/api/payroll/" $null $TOKEN "Get All Payrolls"
Test-API "GET" "/api/payroll/month/report?month=7`&year=2026" $null $TOKEN "Monthly Payroll Report"
if ($EMP_ID) { Test-API "GET" "/api/payroll/$EMP_ID" $null $TOKEN "Get Payroll by Employee" }
if ($PAY_ID) { Test-API "PUT" "/api/payroll/$PAY_ID" @{bonus=6000;status="Paid"} $TOKEN "Update Payroll" }

Write-Host "`n====== PERFORMANCE APIs ======" -ForegroundColor Yellow

$perf = if ($EMP_ID) {
    Test-API "POST" "/api/performance/" @{
        employee=$EMP_ID; reviewPeriod="Q1 2026"
        rating=4; goals="Complete all tasks"
        achievements="Completed 95% tasks"; feedback="Good work"
    } $TOKEN "Create Performance"
} else { $null }
$PERF_ID = if ($perf) { $perf.performance._id } else { $null }

Test-API "GET" "/api/performance/" $null $TOKEN "Get All Performance"
if ($EMP_ID) { Test-API "GET" "/api/performance/$EMP_ID" $null $TOKEN "Get Performance by Employee" }
if ($PERF_ID) { Test-API "PUT" "/api/performance/$PERF_ID" @{rating=5;feedback="Excellent"} $TOKEN "Update Performance" }

Write-Host "`n====== SALARY SLIP APIs ======" -ForegroundColor Yellow

$slip = if ($PAY_ID) { Test-API "POST" "/api/salary-slip/generate" @{payrollId=$PAY_ID} $TOKEN "Generate Salary Slip" } else { $null }
$SLIP_ID = if ($slip) { $slip.salarySlip._id } else { $null }

Test-API "GET" "/api/salary-slip/month/report?month=7`&year=2026" $null $TOKEN "Monthly Salary Slip Report"
if ($EMP_ID) { Test-API "GET" "/api/salary-slip/$EMP_ID" $null $TOKEN "Get Salary Slip by Employee" }
if ($SLIP_ID) { Test-API "GET" "/api/salary-slip/download/$SLIP_ID" $null $TOKEN "Download Salary Slip PDF" }

Write-Host "`n====== CLEANUP ======" -ForegroundColor Yellow

if ($PERF_ID) { Test-API "DELETE" "/api/performance/$PERF_ID" $null $TOKEN "Delete Performance" }
if ($PAY_ID) { Test-API "DELETE" "/api/payroll/$PAY_ID" $null $TOKEN "Delete Payroll" }
if ($LEAVE_ID) { Test-API "DELETE" "/api/leave/$LEAVE_ID" $null $TOKEN "Delete Leave" }
if ($EMP_ID) { Test-API "DELETE" "/api/employees/$EMP_ID" $null $TOKEN "Delete Employee" }

Write-Host "`n=============================" -ForegroundColor Yellow
Write-Host "  PASSED: $global:pass" -ForegroundColor Green
Write-Host "  FAILED: $global:fail" -ForegroundColor Red
Write-Host "  TOTAL : $($global:pass + $global:fail)" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Yellow
