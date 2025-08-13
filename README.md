# MedRemind

MedRemind is a smart medicine reminder web application designed to help users manage their prescriptions and ensure they never miss a dose. It integrates with Google Calendar to automatically set reminders based on prescription data extracted using AI-powered OCR.

## Features

* **AI-powered Prescription Scanner**: Upload a photo of your prescription and let AI extract the medicine names, dosages, and schedules.
* **Google Calendar Integration**: Automatically create and manage medicine reminders directly in Google Calendar.
* **Real-time Reminders**: View upcoming reminders with live updates.
* **Medicine Tracking**: Mark medicines as taken, missed, or snoozed.
* **History Tracking**: Keep a log of past reminders with details on time taken.
* **Infinite Scroll**: Smoothly browse through both reminder and history lists.
* **User Authentication**: Secure sign-in using Google OAuth.

## Tech Stack

* **Frontend**: Next.js, Tailwind CSS, Shadcn UI
* **Backend**: Next.js API Routes, Prisma ORM
* **Database**: PostgreSQL
* **Auth**: NextAuth with Google OAuth
* **Cloud**: Vercel
* **AI/OCR**: Image-to-text LLMs for prescription parsing

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/medremind.git
cd medremind
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables in `.env`:

```
mv .env.example .env
```

4. Run database migrations:

```bash
bunx prisma migrate dev
```

5. Start the development server:

```bash
bun run dev
```

## Usage

1. Sign in with your Google account.
2. Upload a prescription photo.
3. Review the extracted medicines and schedule.
4. Let MedRemind create Google Calendar events.
5. Track and update your reminders.

## License

This project is licensed under the MIT License.
