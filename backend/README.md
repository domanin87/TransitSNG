
TransitSNG Backend with tracking

Endpoints of interest:
- POST /api/v1/track/location  -- mobile posts location (driverId, cargoId, lat, lon, speed)
- GET /api/v1/track/driver/:id  -- get last locations for driver
- socket.io endpoint: connect to backend base URL and listen to 'location_update' events
- Toggle map for cargo (admin or after payment): POST /api/v1/cargos/:id/map_enable { enabled: true }

Migrate and run:
cp .env.example .env
npm install
npm run migrate
npm start
