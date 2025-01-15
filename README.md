# Easy Inventory Management System

A modern inventory management system built with Next.js that helps businesses track and manage their inventory items efficiently.

## Features

- 🔐 User Authentication (Sign up/Sign in)
- 📦 Inventory Management
  - Add new items
  - Update existing items
  - Delete items
  - Real-time stock level indicators
- 📊 Stock Level Monitoring
  - Visual indicators for low/medium/high stock levels
  - Percentage-based stock status
- 🎯 Optimistic Updates
  - Instant UI feedback
  - Background synchronization
- 📱 Responsive Design
  - Works on desktop and mobile devices
- 🚀 Modern UI with animations

## Tech Stack

- **Frontend:**
  - Next.js - 15 (App Router)
  - React - 19
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Icons

- **State Management:**
  - Zustand

- **Testing:**
  - Jest
  - React Testing Library

- **UI Components:**
  - React Toastify
  - Custom Components

- **Database:**
  - SQLite

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/kmdshojib/easy-inventory.git
cd easyinventory
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # Reusable components
├── store/             # Zustand store definitions
├── utils/             # Utility functions
└── tests/             # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
