@echo off
echo Starting HobbyHub Backend...
start cmd /k "cd backend && .\mvnw.cmd spring-boot:run"

echo Starting HobbyHub Frontend...
start cmd /k "cd frontend && npm run dev"

echo HobbyHub is starting! Both windows have been opened.
exit
