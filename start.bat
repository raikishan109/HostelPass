@echo off
echo Starting Hostel-Pass Development Servers...

:: Start Backend
start cmd /k "echo [BACKEND] Starting... && cd backend && npm run dev"

:: Start Student Portal
start cmd /k "echo [STUDENT PORTAL] Starting... && cd frontend/Student-Portal && npm run dev"

:: Start Partner Portal
start cmd /k "echo [PARTNER PORTAL] Starting... && cd frontend/Partner-Portal && npm run dev -- --port 5174"

:: Start Admin Portal
start cmd /k "echo [ADMIN PORTAL] Starting... && cd frontend/Admin-Portal && npm run dev -- --port 5175"

echo.
echo All servers are starting in separate windows.
echo - Backend: http://localhost:5000
echo - Student: http://localhost:5173
echo - Partner: http://localhost:5174
echo - Admin: http://localhost:5175
pause
