Param(
    [string]$env = "localhost"
)

Write-Host "🔧 Selected environment: $env"

$ENV_FILE = ".env"
$COMPOSE_OVERRIDE = ""

# Copy .env.example to .env if not present
if (-Not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Copy-Item ".env.example" ".env"
}


        Write-Host "🔧 Environment: localhost"
        $COMPOSE_OVERRIDE = "docker-compose.local.yml"
        $ENV_FILE = ".env"
        $Env:ENV = "localhost"
 $COMPOSE_FILE = "docker-compose.yml"

# Run Docker Compose
Write-Host "🚀 Running: docker compose -f $COMPOSE_FILE -f $COMPOSE_OVERRIDE --env-file $ENV_FILE up -d --build"
docker compose -f $COMPOSE_FILE -f $COMPOSE_OVERRIDE --env-file $ENV_FILE up -d --build
