
---

# Kanban Project

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Local Development Setup](#local-development-setup)
- [Database Schema](#database-schema)
- [Basic Functionality](#basic-functionality)

## Project Overview
Kanban is a project management tool designed to help users visualize their work, limit work-in-progress, and maximize efficiency. This application supports user login, registration, board creation, swimlane management, and card manipulation within a Kanban board.

## Technologies Used

### Frontend
- Angular 17
- Tailwind CSS
- Angular Material
- JWT for authentication

### Backend
- NestJS
- TypeORM
- MySQL

## Local Development Setup

### Prerequisites
- Docker
- Node.js
- npm

### Step-by-Step Guide

1. **Start MySQL and Adminer Containers**

   Navigate to the `backend` folder and run the following command:
   ```bash
   docker compose up
   ```

2. **Start Backend Server**

   While still in the `backend` folder, run:
   ```bash
   npm run start:dev
   ```

3. **Start Frontend Application**

   Navigate to the `frontend` folder and run:
   ```bash
   ng serve --o
   ```

4. **View Database Schema**

   Open your browser and go to [http://localhost:8080](http://localhost:8080) to access Adminer and view your database tables and schema.


## Basic Functionality
- **User Login:** Users can log in to the application.
- **User Registration:** New users can register for an account.
- **Board Management:** Users can create and view boards.
- **Swimlane Management:** Users can add swimlanes to boards and view them.
- **Card Management:** Users can add cards to swimlanes, view cards, and drag and drop cards within or between swimlanes.

---
