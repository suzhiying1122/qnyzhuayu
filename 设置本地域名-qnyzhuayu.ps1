$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$entries = @(
    "127.0.0.1 qnyzhuayu.cn",
    "127.0.0.1 www.qnyzhuayu.cn"
)

$current = Get-Content -LiteralPath $hostsPath -ErrorAction Stop
$newLines = @()

foreach ($entry in $entries) {
    $domain = ($entry -split "\s+")[-1]
    if ($current -notmatch "^\s*127\.0\.0\.1\s+$([regex]::Escape($domain))\s*$") {
        $newLines += $entry
    }
}

if ($newLines.Count -eq 0) {
    Write-Host "qnyzhuayu.cn 本地域名映射已存在。"
    exit 0
}

Add-Content -LiteralPath $hostsPath -Value $newLines
ipconfig /flushdns | Out-Null
Write-Host "已添加本地域名映射："
$newLines | ForEach-Object { Write-Host $_ }
Write-Host "现在可在本机访问：http://qnyzhuayu.cn:8000/"
