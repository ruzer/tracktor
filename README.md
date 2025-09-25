> ⚠️ **WARNING:**
> Tracktor is under active development. There may be frequent breaking changes, though we are taking precautions but it is **not stable for production use**.
> _Please keep regular backups of your data!_

<div align="center" style="margin-bottom: 20px;">
  <img src="./docs/screenshots/logo.svg" style="height:60px; margin-right: 10px; vertical-align: middle;"/>
  <h1 style="display:inline; font-size: 2.5rem; vertical-align: middle;">Tracktor</h1>
</div>

<p align="center" style="font-size: 1.2rem;">
  <b>Tracktor</b> is an open-source web application for <b>comprehensive vehicle management</b>.<br>
  Easily track <span style="color:#4ade80;">⛽ fuel</span> consumption, <span style="color:#fbbf24;">🛠️ maintenance</span>, <span style="color:#60a5fa;">🛡️ insurance</span>, and <span style="color:#a78bfa;">📄 regulatory documents</span> for all your vehicles in one place.
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/screenshots/dashboard-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./docs/screenshots/dashboard-light.png" />
    <img alt="Dashboard" src="./docs/screenshots/dashboard-light.png" width="90%" style="border-radius: 10px" />
  </picture>
</p>

## ✨ Features

- 🚗 **Vehicle Management:** Add, edit, and manage multiple vehicles.
- ⛽ **Fuel Tracking:** Log fuel refills and monitor fuel efficiency over time.
- 🛠️ **Maintenance Log:** Record and view maintenance history for each vehicle.
- 📄 **Document Tracking:** Track insurance, pollution certificates, and other important documents.
- 📊 **Dashboard:** Visualize key metrics and upcoming renewals.
- 🔒 **User Authentication:** Secure access to your data.
- 🔍 **Flexible Views:** Switch between card and table views and find vehicles instantly with global search.
- 📥 **Bulk Imports:** Load complete vehicle fleets from CSV/XLSX files, including insurance and resguardo assignments.

## 🖼️ Screenshots

<p align="center">
  <h3>🔐 Login Page</h3><br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/screenshots/login-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./docs/screenshots/login-light.png" />
    <img alt="Login Page" src="./docs/screenshots/login-light.png" style="border-radius: 10px" />
  </picture>
</p>
<p align="center">
  <h3>📈 Charts</h3><br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/screenshots/charts-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./docs/screenshots/charts-light.png" />
    <img alt="Login Page" src="./docs/screenshots/charts-light.png" style="border-radius: 10px" />
  </picture>
</p>
<p align="center">
  <h3>⛽ Fuel Log</h3><br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/screenshots/fuel-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./docs/screenshots/fuel-light.png" />
    <img alt="Fuel Log" src="./docs/screenshots/fuel-light.png" style="border-radius: 10px" />
  </picture>
</p>
<p align="center">
  <h3>🛠️ Maintenance Log</h3><br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/screenshots/maintenance-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./docs/screenshots/maintenance-light.png" />
    <img alt="Maintenance Log" src="./docs/screenshots/maintenance-light.png" style="border-radius: 10px" />
  </picture>
</p>
<p align="center">
  <h3>🛡️ Insurance Details</h3><br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/screenshots/insurance-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./docs/screenshots/insurance-light.png" />
    <img alt="Insurance Details" src="./docs/screenshots/insurance-light.png" style="border-radius: 10px" />
  </picture>
</p>
<p align="center">
  <h3>📄 PUCC Details</h3><br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/screenshots/pucc-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./docs/screenshots/pucc-light.png" />
    <img alt="PUCC Details" src="./docs/screenshots/pucc-light.png" style="border-radius: 10px" />
  </picture>
</p>

## 🛠️ Tech Stack

- 🎨 **Frontend:** SvelteKit, Tailwind CSS
- 🖥️ **Backend:** Node.js, Express.js
- 🗄️ **Database:** SQLite, sequelize ORM
- 🐳 **Containerization:** Docker & Docker Compose

## 🚀 Getting Started

Please check the [installation guide](./docs/INSTALL.md) for detailed instructions on setting up the project.

## 📥 Bulk Vehicle Import

- Use the Vehicles ▸ Import vehicles option in the top navigation to upload a `.csv`, `.xlsx`, or `.xls` file.
- Required columns: `make`, `model`, `year`, `licensePlate`.
- Optional columns let you preload VIN, color, odometer, insurance (`insuranceProvider`, `insurancePolicyNumber`, `insuranceStartDate`, `insuranceEndDate`, `insuranceCost`, `insuranceNotes`) and the active resguardo (`assigneeName`, `assigneeRole`, `assignmentArea`, `assignmentUnit`, `assignmentStartDate`, `assignmentEndDate`, `assignmentNotes`).
- A ready-to-edit template is available directly from the importer.

## 🧭 Module navigation

- **Vehicles:** jump to the fleet workspace with card/table views, filters and the dedicated *Import vehicles* sub-menu for bulk uploads.
- **Insurance:** manage individual policies and access the new *Collective insurance* sub-module with guidance for group programmes.
- Both modules live in the top navigation, keeping a consistent layout so users can switch contexts without losing their place.


## 🤝 Contributing

Contributions are welcome! Please read the [contributing guidelines](./docs/CONTRIBUTING.md) before submitting a pull request.

Please consider supporting this project by giving it a star! ⭐ or [sponsoring](https://github.com/sponsors/javedh-dev).

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📊 Repository activity

![Activities](https://repobeats.axiom.co/api/embed/d41931a72a5373ee0d2073e72279862171468023.svg "Repobeats analytics image")

## ⭐ Star History

<a href="https://www.star-history.com/#javedh-dev/tracktor&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=javedh-dev/tracktor&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=javedh-dev/tracktor&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=javedh-dev/tracktor&type=Date" />
 </picture>
</a>

## 🤝 Contributors

<a href="https://github.com/javedh-dev/tracktor/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=javedh-dev/tracktor"/>
</a>
