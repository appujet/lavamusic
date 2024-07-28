@echo off

echo Installing npm packages...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install npm packages.
    exit /b %errorlevel%
)

cls
echo Building the Lavamusic application...
npm run clean
if %errorlevel% neq 0 (
    echo Error: Build failed.
    exit /b %errorlevel%
)

cls
echo Starting the Lavamusic application...
node .
if %errorlevel% neq 0 (
    echo Error: Failed to start the Lavamusic application.
    exit /b %errorlevel%
)
