# Minders Fly

Demo app simulating a premium Latin American airline for an Amplitude demo.

## Installation
Dependencies are managed via `package.json`. Use `npm install` to install them.

## Environment Variables
Copy `.env.example` to `.env` or set the following variables:
- `VITE_AMPLITUDE_API_KEY`: API Key for Amplitude analytics. If not provided, events are logged locally in the Event Debugger (`/demo/event-debugger`).

## Running Locally
Run `npm run dev` to start the Vite development server.

## Building and Deploying
Run `npm run build` to build the application for production. The output will be in the `dist` directory. Serve using any static server or deploy to your preferred hosting provider.

## Demo Mode
- **Simulated Environment:** All payments, bookings, and data are simulated. This site is not affiliated with LATAM Airlines.
- **Event Debugger:** Access `/demo/event-debugger` to view events captured locally.
- **Error Simulator:** Access `/demo/error-lab` to simulate various app errors.
