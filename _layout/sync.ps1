# Copies the shared head / header / footer from this folder into every page.
# Edit head.html, header.html or footer.html here, then run:
#   powershell -ExecutionPolicy Bypass -File _layout\sync.ps1
# (Folders starting with _ are not published by GitHub Pages.)
$root = Split-Path $PSScriptRoot -Parent
$parts = @{}
foreach ($k in 'head', 'header', 'footer') { $parts[$k] = [IO.File]::ReadAllText("$PSScriptRoot\$k.html").TrimEnd() }
$utf8 = New-Object Text.UTF8Encoding $false

Get-ChildItem $root -Recurse -Filter *.html | Where-Object { $_.FullName.Substring($root.Length + 1) -notmatch '^_' -and $_.Name -ne '404.html' } | ForEach-Object {
  # (skips _layout, _concepts, _backup-v2 and any other folder starting with _)
  $rel = $_.FullName.Substring($root.Length + 1)
  $depth = $rel.Split('\').Count - 1
  $P = '../' * $depth
  $key = if ($rel -like 'blog\*') { 'blog' } else { [IO.Path]::GetFileNameWithoutExtension($_.Name) }
  $html = [IO.File]::ReadAllText($_.FullName)
  foreach ($k in 'head', 'header', 'footer') {
    $block = $parts[$k].Replace('{{P}}', $P)
    if ($k -eq 'header') { $block = $block.Replace("data-nav=""$key""", "data-nav=""$key"" aria-current=""page""") }
    $pattern = "(?s)<!-- @$k -->.*?<!-- /@$k -->"
    $html = [regex]::Replace($html, $pattern, [System.Text.RegularExpressions.MatchEvaluator] { param($m) "<!-- @$k -->`r`n$block`r`n  <!-- /@$k -->" })
  }
  [IO.File]::WriteAllText($_.FullName, $html, $utf8)
  "synced $rel"
}
