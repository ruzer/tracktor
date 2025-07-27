# Tracktor

![Tracktor Logo](app/docs/public/logo-dark.svg#gh-dark-mode-only)
![Tracktor Logo](app/docs/public/logo-light.svg#gh-light-mode-only)

Tracktor is an open-source web application for comprehensive vehicle management. Easily track fuel consumption, maintenance, insurance, and regulatory documents for all your vehicles in one place.

<p align="center">
  <img src="app/docs/public/screenshots/dashboard.png" alt="Dashboard" width="90%" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
</p>

## Features

- **Vehicle Management:** Add, edit, and manage multiple vehicles.
- **Fuel Tracking:** Log fuel refills and monitor fuel efficiency over time.
- **Maintenance Log:** Record and view maintenance history for each vehicle.
- **Document Tracking:** Track insurance, pollution certificates, and other important documents.
- **Dashboard:** Visualize key metrics and upcoming renewals.
- **User Authentication:** Secure access to your data.

## Screenshots

<p align="center">
  <h3>Login Page</h3><br>
  <img src="app/docs/public/screenshots/login.png" alt="Login Page" width="90%" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
</p>
<p align="center">
  <h3>Charts</h3><br>
  <img src="app/docs/public/screenshots/charts.png" alt="Charts" width="90%" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
</p>
<p align="center">
  <h3>Fuel Log</h3><br>
  <img src="app/docs/public/screenshots/fuel.png" alt="Fuel Log" width="90%" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
</p>
<p align="center">
  <h3>Maintenance Log</h3><br>
  <img src="app/docs/public/screenshots/maintenance.png" alt="Maintenance Log" width="90%" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
</p>
<p align="center">
  <h3>Insurance Details</h3><br>
  <img src="app/docs/public/screenshots/insurance.png" alt="Insurance Details" width="90%" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
</p>
<p align="center">
  <h3>PUCC Details</h3><br>
  <img src="app/docs/public/screenshots/pucc.png" alt="PUCC Details" width="90%" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
</p>

## Tech Stack

- **Frontend:** SvelteKit, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Documentation:** VitePress
- **Containerization:** Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- Docker & Docker Compose (for containerized setup)

### Installation (Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tracktor.git
   cd tracktor
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:**
   Navigate to `http://localhost:5173` for the frontend.

### Running with Docker Compose

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```
2. **Access the app:**
   - Main App: `http://localhost:3000`
   - Docs: `http://localhost:5173`

## Contributing

Contributions are welcome! Please read the [contributing guidelines](app/docs/contributing.md) before submitting a pull request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
