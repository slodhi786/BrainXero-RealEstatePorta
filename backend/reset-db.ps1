Write-Host "====================================" -ForegroundColor Cyan
Write-Host " RealEstatePortal - Database Reset " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Set project paths
$PersistenceProject = "RealEstate.Infrastructure.Persistence"
$StartupProject = "RealEstate.Presentation.WebApi"

# Drop existing database
Write-Host "`nDropping existing database..." -ForegroundColor Yellow
dotnet ef database drop --project $PersistenceProject --startup-project $StartupProject --force

# Remove existing migrations (optional — uncomment if you want a clean migrations folder each time)
# Write-Host "Removing existing migrations..." -ForegroundColor Yellow
# Remove-Item "$PersistenceProject/Migrations" -Recurse -Force -ErrorAction SilentlyContinue

# Add initial migration
Write-Host "`nAdding new migration 'InitialCreate'..." -ForegroundColor Yellow
dotnet ef migrations add InitialCreate --project $PersistenceProject --startup-project $StartupProject

# Update (apply migrations to database)
Write-Host "`nUpdating database..." -ForegroundColor Yellow
dotnet ef database update --project $PersistenceProject --startup-project $StartupProject

Write-Host "`nDatabase reset and seeded successfully! ✅" -ForegroundColor Green
