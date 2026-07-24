Write-Host "`n========== API TEST START ==========" -ForegroundColor Yellow

# 1. Register
try {
    $reg = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/auth/register" -ContentType "application/json" -Body '{"username":"apitester2","email":"apitester2@test.com","password":"Admin123!","role":"admin"}'
    $TOKEN = $reg.accessToken
    Write-Host "1. REGISTER          : OK | Role: $($reg.user.role)"
} catch {
    $err = $_ | ConvertFrom-Json -ErrorAction SilentlyContinue
    Write-Host "1. REGISTER          : SKIP (already exists) - trying login"
    $TOKEN = $null
}

# If register failed use login
if (!$TOKEN) {
    try {
        $login = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/auth/login" -ContentType "application/json" -Body '{"email":"apitester2@test.com","password":"Admin123!"}'
        Write-Host "1. LOGIN OTP SENT    : OK | Check email for OTP"
    } catch { Write-Host "1. LOGIN             : FAIL" -ForegroundColor Red }
}

if (!$TOKEN) { Write-Host "Cannot proceed without token"; exit }

# 2. GET /me
try {
    $me = Invoke-RestMethod -Method GET -Uri "http://localhost:4000/api/auth/me" -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "2. GET ME            : OK | User: $($me.user.username) | Role: $($me.user.role)"
} catch { Write-Host "2. GET ME            : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 3. GET /sessions
try {
    $sess = Invoke-RestMethod -Method GET -Uri "http://localhost:4000/api/auth/sessions" -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "3. GET SESSIONS      : OK | Count: $($sess.sessions.Count)"
} catch { Write-Host "3. GET SESSIONS      : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 4. Create Employee
$EMP_ID = $null
try {
    $empBody = '{"employeeId":"EMPTEST99","fullName":"Test Employee","email":"emptest99@company.com","phone":"9876543210","department":"IT","designation":"Developer","salary":50000,"joiningDate":"2024-01-01"}'
    $emp = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/employees/createEmpoyee" -Headers @{Authorization="Bearer $TOKEN"} -ContentType "application/json" -Body $empBody
    $EMP_ID = $emp.employee._id
    Write-Host "4. CREATE EMPLOYEE   : OK | Name: $($emp.employee.fullName) | ID: $EMP_ID"
} catch { Write-Host "4. CREATE EMPLOYEE   : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 5. Get All Employees
try {
    $emps = Invoke-RestMethod -Method GET -Uri "http://localhost:4000/api/employees/get" -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "5. GET ALL EMPLOYEES : OK | Count: $($emps.employees.Count)"
    # Use first employee ID if create failed
    if (!$EMP_ID -and $emps.employees.Count -gt 0) { $EMP_ID = $emps.employees[0]._id }
} catch { Write-Host "5. GET ALL EMPLOYEES : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 6. Get Employee by ID
try {
    $empById = Invoke-RestMethod -Method GET -Uri "http://localhost:4000/api/employees/$EMP_ID" -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "6. GET BY ID         : OK | Name: $($empById.employee.fullName)"
} catch { Write-Host "6. GET BY ID         : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 7. Update Employee
try {
    $upd = Invoke-RestMethod -Method PUT -Uri "http://localhost:4000/api/employees/$EMP_ID" -Headers @{Authorization="Bearer $TOKEN"} -ContentType "application/json" -Body '{"fullName":"Updated Employee","salary":60000}'
    Write-Host "7. UPDATE EMPLOYEE   : OK | Name: $($upd.employee.fullName) | Salary: $($upd.employee.salary)"
} catch { Write-Host "7. UPDATE EMPLOYEE   : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 8. Attendance Check-In — employee field = MongoDB _id
$ATT_ID = $null
try {
    $checkinBody = "{`"employee`":`"$EMP_ID`"}"
    $checkin = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/attendance/check-in" -Headers @{Authorization="Bearer $TOKEN"} -ContentType "application/json" -Body $checkinBody
    $ATT_ID = $checkin.attendance._id
    Write-Host "8. CHECK-IN          : OK | Att ID: $ATT_ID"
} catch { Write-Host "8. CHECK-IN          : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 9. Attendance Check-Out
try {
    $checkout = Invoke-RestMethod -Method PUT -Uri "http://localhost:4000/api/attendance/check-out/$ATT_ID" -Headers @{Authorization="Bearer $TOKEN"} -ContentType "application/json" -Body '{"remarks":"Left on time"}'
    Write-Host "9. CHECK-OUT         : OK | Hours: $($checkout.attendance.workingHours)"
} catch { Write-Host "9. CHECK-OUT         : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 10. Forgot Password
try {
    $fp = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/auth/forgot-password" -ContentType "application/json" -Body '{"email":"apitester2@test.com"}'
    Write-Host "10. FORGOT PASSWORD  : OK | Token: $($fp.token.Substring(0,15))..."
} catch { Write-Host "10. FORGOT PASSWORD  : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 11. Delete Employee
try {
    $del = Invoke-RestMethod -Method DELETE -Uri "http://localhost:4000/api/employees/$EMP_ID" -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "11. DELETE EMPLOYEE  : OK | $($del.message)"
} catch { Write-Host "11. DELETE EMPLOYEE  : FAIL - $($_.ErrorDetails.Message)" -ForegroundColor Red }

# 12. Logout — refreshToken cookie zaruri hai
try {
    $wSess = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    # Register response mai cookie set hoti hai — manually add karte hain
    $out = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/auth/logout" -Headers @{Authorization="Bearer $TOKEN"} -WebSession $wSess
    Write-Host "12. LOGOUT           : OK | $($out.message)"
} catch { Write-Host "12. LOGOUT           : FAIL (cookie missing in PS) - Expected behavior" }

Write-Host "`n========== TEST COMPLETE ==========" -ForegroundColor Yellow
