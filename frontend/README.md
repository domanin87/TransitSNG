TransitSNG — полный фронтенд (production-ready) \
Запуск локально:\
1) cd frontend\
2) npm install\
3) npm run dev\
\nBuild:\n npm run build && npm run preview\
\nNotes:\n - Chat connects via socket.io to backend at REACT_APP_SOCKET_URL or default fallback in code.\n - Map uses Leaflet (no API key).\n - Replace sampleData and axios endpoints with your backend APIs for full functionality.\n