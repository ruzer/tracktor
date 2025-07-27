# Introduction

Tracktor is a comprehensive web application designed to simplify the management of your vehicle from many aspects. Whether you have a single car or a small fleet, **Tracktor** provides the tools you need to stay organized and keep a track of your vehicle metrices over the time.

## Technical Overview

Tracktor is built on a modern technology stack for performance, scalability, and maintainability:

* **Frontend:** Svelte 5 for a reactive, component-based UI
* **Styling:** Tailwind CSS for responsive, mobile-friendly design
* **Backend:** Express.js with TypeScript for a robust, type-safe RESTful API
* **Database:** SQLite, managed via Sequelize ORM for efficient data operations

The system follows a client-server architecture, with a clear separation between frontend, backend, and database layers. All sensitive operations are protected by secure PIN-based authentication and server-side validation.

## What is Tracktor?

At its core, Tracktor is a centralized dashboard for all your vehicle-related information. It allows you to meticulously track:

* **Vehicle Details:** Store and manage essential information about your vehicles, including make, model, year, VIN, license plate, and more.
* **Fuel Consumption:** Log every refuel and let Tracktor automatically calculate your vehicle's fuel efficiency over time. This helps you monitor performance and identify potential issues early.
* **Maintenance History:** Keep a detailed log of all maintenance activities, from simple oil changes to major repairs. A complete service history can significantly increase a vehicle's resale value.
* **Important Documents:** Never miss a renewal date again. Tracktor helps you manage critical documents like insurance policies and pollution certificates, with upcoming features for renewal reminders.

## Key Features

* **User Management:** Secure registration and PIN-based authentication, with hashed credentials and profile management.
* **Vehicle Management:** Add and manage multiple vehicles with detailed profiles, including unique identifiers and odometer tracking.
* **Fuel Tracking:** Log fuel refills, track expenses, and automatically calculate mileage and efficiency.
* **Maintenance Tracking:** Record service history, schedule upcoming maintenance, and receive reminders (future enhancement).
* **Insurance & Pollution Certificate Management:** Store policy details, upload documents, and get renewal/expiration alerts (future enhancement).

## Screenshots

### Login Page

<img src="/screenshots/login.png" alt="Login Page" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">

### Dashboard

<img src="/screenshots/dashboard.png" alt="Dashboard" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">

### Charts

<img src="/screenshots/charts.png" alt="Charts" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">

### Fuel Log

<img src="/screenshots/fuel.png" alt="Fuel Log" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">

### Maintenance Log

<img src="/screenshots/maintenance.png" alt="Maintenance Log" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">

### Insurance Details

<img src="/screenshots/insurance.png" alt="Insurance Details" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">

### PUCC Details

<img src="/screenshots/pucc.png" alt="PUCC Details" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">

## Non-Functional Strengths

Tracktor is designed for:

* **Performance:** Fast UI rendering, efficient database queries, and minimal resource consumption.
* **Security:** PIN-based authentication, secure file handling, and input validation.
* **Usability:** Responsive design, intuitive navigation, and mobile-friendly interface.
* **Scalability & Maintainability:** Modular code structure and type-safe API endpoints.

## How Tracktor Can Help You

Tracktor is designed to save you time, money, and stress by:

* **Improving Organization:** No more sifting through glove compartments or messy folders for vehicle documents. Everything is stored securely in one place, accessible from anywhere.
* **Enhancing Vehicle Longevity:** By keeping a close eye on fuel efficiency and maintaining a consistent service history, you can extend the life of your vehicle and prevent costly breakdowns.
* **Boosting Resale Value:** A well-documented service history is a major selling point for potential buyers. Tracktor provides a professional and detailed record of your vehicle's care.
* **Providing Peace of Mind:** With reminders for important dates and a clear overview of your vehicle's health, you can drive with confidence, knowing that everything is up-to-date and in good order.

This documentation will guide you through deploying your own instance of Tracktor, understanding its API, and contributing to its development.
