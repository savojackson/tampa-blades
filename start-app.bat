@echo off
echo Starting Tampa Blades Application...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"
echo Backend server started on http://localhost:4000
echo.
echo Starting Frontend App...
start "Frontend App" cmd /k "npm start"
echo Frontend app starting on http://localhost:3000
echo.
echo Both servers are now running!
echo Press any key to close this window...
pause >nul 