Param(
    [string]$env = "localhost"
)

Write-Host "🔧 Selected environment: $env"

$COMPOSE_FILE = "docker-compose.yml"
$ENV_FILE = ".env"
$COMPOSE_OVERRIDE = ""

# Copy .env.example to .env if not present
if (-Not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Copy-Item ".env.example" ".env"
}

switch ($env) {
    "localhost" {
        Write-Host "🔧 Environment: localhost"
        $COMPOSE_OVERRIDE = "docker-compose.local.yml"
        $ENV_FILE = ".env"
        $Env:ENV = "localhost"
    }
    default {
        Write-Host "❌ Invalid environment: $env"
        Write-Host "Usage: .\scripts\dev_setup.ps1 [localhost|dev|preprod|prod]"
        exit 1
    }
}

# Run Docker Compose
Write-Host "🚀 Running: docker-compose -f $COMPOSE_FILE -f $COMPOSE_OVERRIDE --env-file $ENV_FILE up -d --build"
docker-compose -f $COMPOSE_FILE -f $COMPOSE_OVERRIDE --env-file $ENV_FILE up -d --build
