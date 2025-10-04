# Corrected PowerShell command to test the login API

# Method 1: Using body as JSON string
$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/login' -Method Post -Body '{"username":"admin","password":"password"}' -ContentType 'application/json'
Write-Output "Response: $($response | ConvertTo-Json -Depth 10)"

# Method 2: Using body as hashtable (PowerShell 7+)
$body = @{
    username = "admin"
    password = "password"
} | ConvertTo-Json

$response2 = Invoke-RestMethod -Uri 'http://localhost:3000/api/login' -Method Post -Body $body -ContentType 'application/json'
Write-Output "Response2: $($response2 | ConvertTo-Json -Depth 10)"

# Method 3: Using PowerShell 7+ simplified syntax (if available)
if ($PSVersionTable.PSVersion.Major -ge 7) {
    $response3 = Invoke-RestMethod -Uri 'http://localhost:3000/api/login' -Method Post -Body @{username="admin";password="password"} -ContentType 'application/json'
    Write-Output "Response3: $($response3 | ConvertTo-Json -Depth 10)"
}
