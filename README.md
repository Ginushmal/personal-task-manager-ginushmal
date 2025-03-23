# Task Flow

**Live Demo:** [https://task-flow-wlo4.onrender.com](https://task-flow-wlo4.onrender.com)

## Overview
Task Flow is a task management application built with **Next.js 14**, designed to showcase seamless authentication, data management, and efficient frontend state handling. It is currently deployed on **Render**.

## Technologies Used
- **Next.js 14** - React framework for building the UI and API routes.
- **Clerk** - Authentication provider for secure user login and management.
- **Prisma** - ORM for interacting with a **MongoDB Atlas** database.
- **Zod** - Schema validation to ensure safe and correct user inputs.
- **Next.js API Routes** - Used to fetch and manipulate data from the database.
- **Server Actions** - Utilized to retrieve MongoDB document IDs using Clerk user IDs.
- **SWR with Custom Hooks** - Optimized data fetching and caching.
- **SWR Cache Mutations** - Used to update frontend data efficiently without unnecessary refetching.
- **Zustand** - State management for managing global application state efficiently.

## Getting Started

First, install dependencies:
```bash
pnpm install
```

Then, run the development server:
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Learn More
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Prisma Documentation](https://www.prisma.io/docs/) - ORM details for MongoDB integration.
- [Clerk Authentication](https://clerk.com/docs) - Secure user authentication.
- [SWR](https://swr.vercel.app/) - Data fetching and caching optimization.
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management for React applications.

Task Flow is currently hosted on **Render** for demonstration purposes. 🚀

