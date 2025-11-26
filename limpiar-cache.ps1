# Script para limpiar el cache de Next.js
Write-Host "Limpiando cache de Next.js..." -ForegroundColor Yellow

if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Cache limpiado (.next eliminado)" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No hay cache para limpiar" -ForegroundColor Gray
}

Write-Host "`nAhora reinicia el servidor con: npm run dev" -ForegroundColor Cyan






