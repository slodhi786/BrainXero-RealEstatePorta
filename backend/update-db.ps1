Write-Host "===============================" -ForegroundColor Cyan
Write-Host " RealEstatePortal - DB Update " -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Set project paths
$PersistenceProject = "RealEstate.Infrastructure.Persistence"
$StartupProject = "RealEstate.Presentation.WebApi"

# Add migration
param (
    [string]$MigrationName = ""
)

if (-not [string]::IsNullOrWhiteSpace($MigrationName)) {
    Write-Host "`nAdding migration '$MigrationName'..." -ForegroundColor Yellow
    dotnet ef migrations add $MigrationName --project $PersistenceProject --startup-project $StartupProject
} else {
    Write-Host "`nNo migration name provided. Skipping migration add step." -ForegroundColor Yellow
}

# Update (apply migrations)
Write-Host "`nUpdating database..." -ForegroundColor Yellow
dotnet ef database update --project $PersistenceProject --startup-project $StartupProject

Write-Host "`nDatabase update complete! ✅" -ForegroundColor Green
