@echo off

echo Installing npm packages...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install npm packages.
    exit /b %errorlevel%
)
echo Successfully installed npm packages.

echo Building the lavamusic application...
npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed.
    exit /b %errorlevel%
)
echo Successfully built the lavamusic application.

echo Starting the lavamusic application...
npm start
if %errorlevel% neq 0 (
    echo Error: Failed to start the lavamusic application.
    exit /b %errorlevel%
)
echo lavamusic application started successfully.
