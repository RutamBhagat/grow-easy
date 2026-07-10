<div align="center">
  <img src="./public/favicon.ico" alt="GrowEasy logo" width="72" height="72" />
  <h1>GrowEasy CSV Importer</h1>
  <p>Preview CSV files with any column layout, then use AI to transform confirmed rows into structured GrowEasy CRM leads.</p>
</div>

## Overview

GrowEasy CSV Importer accepts messy lead exports from spreadsheets, ad platforms, and other CRMs without requiring fixed column names. Users can inspect the parsed CSV before anything is sent to the backend. After confirmation, the API maps each row by meaning, validates the structured result, and separates usable leads from skipped rows.

### Features

- Drag-and-drop or file-picker uploads for CSV files up to 4.5 MB
- Client-side preview of the first 100 rows with scrollable, sticky-header tables
- AI-assisted mapping to 15 GrowEasy CRM fields in batches of 20
- Structured validation for CRM statuses, data sources, and skipped records
- Imported and skipped lead tables with totals and skip reasons
- Session-scoped result persistence in the browser
- OpenAI-compatible provider support and a production Docker image

## How it works

1. Select a CSV from **Lead Source → Import leads**.
2. Review the local preview; no AI request is made at this stage.
3. Select **Confirm import** to upload the file to `POST /api/import`.
4. The server parses the CSV, sends rows to the configured model in batches, validates the response, and returns imported and skipped records.
5. The app displays the result under **Manage Leads**.

Rows without an email address or mobile number are skipped. Unknown values are left blank instead of being invented.

## Tech stack

| Layer | Technology |
| --- | --- |
| Web app | Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| API | Express 5 through a Next.js Pages Router API entry point |
| CSV | `csv-parse`, Multer |
| AI | Vercel AI SDK, OpenAI-compatible provider |
| Validation and state | Zod, Zustand |

## Getting started

### Prerequisites

- Node.js 22
- npm
- An API key and model from OpenAI or an OpenAI-compatible provider

### Configure the environment

```bash
cp .env.example .env
```

Add your provider settings to `.env`:

```dotenv
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=your-model-name
# Optional; defaults to the OpenAI API.
OPENAI_BASE_URL=https://api.openai.com/v1
```

> [!IMPORTANT]
> The configured model and provider must support structured outputs. Never commit the `.env` file or an API key.

### Run locally

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). A ready-to-use test file is available at [`public/sample.csv`](./public/sample.csv).

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Returns the API health status. |
| `POST` | `/api/import` | Accepts a CSV in the multipart `file` field and returns extracted CRM records. |

Upload the sample CSV with `curl`:

```bash
curl --fail-with-body \
  -X POST \
  -F "file=@public/sample.csv;type=text/csv" \
  http://localhost:3000/api/import
```

Example response, captured by running the command against the development server:

```json
{
  "records": [
    {
      "created_at": "2026-07-11T16:15:00",
      "name": "Aarav Mehta",
      "email": "aarav.mehta@example.com",
      "country_code": "+91",
      "mobile_without_country_code": "98765 43210",
      "company": "Mehta Builders",
      "city": "Pune",
      "state": "Maharashtra",
      "country": "India",
      "lead_owner": "neha@groweasy.ai",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "Asked for a 3 BHK brochure; alternate email and phone are also valid. Additional email: accounts@mehtabuilders.in. Additional phone: +91 99887 76655. Pipeline outcome: Call again next Tuesday.",
      "data_source": "meridian_tower",
      "possession_time": "December 2026",
      "description": ""
    },
    {
      "created_at": "2026-07-10T09:30:00+05:30",
      "name": "Melissa Carter",
      "email": "melissa@northstar.example",
      "country_code": "+1",
      "mobile_without_country_code": "(415) 555-0182",
      "company": "Northstar Realty",
      "city": "San Francisco",
      "state": "CA",
      "country": "USA",
      "lead_owner": "ryan@groweasy.ai",
      "crm_status": "SALE_DONE",
      "crm_note": "Signed the agreement. Send onboarding details to the second email too. Additional email: mel.carter@example.org. Campaign / Project: Website referral.",
      "data_source": "",
      "possession_time": "Ready to move",
      "description": ""
    },
    {
      "created_at": "2026-07-08T10:45:00",
      "name": "Rohan Iyer",
      "email": "rohan.iyer@example.in",
      "country_code": "+91",
      "mobile_without_country_code": "99000-11223",
      "company": "Iyer Consulting",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "lead_owner": "anita@groweasy.ai",
      "crm_status": "DID_NOT_CONNECT",
      "crm_note": "Phone rang twice; retry after 6 PM",
      "data_source": "sarjapur_plots",
      "possession_time": "Within 6 months",
      "description": ""
    }
  ],
  "skippedRecords": [
    {
      "source": {
        "Submitted On": "2026-07-09",
        "Full Name / Contact": "Anonymous Event Visitor",
        "Email Address(es)": "",
        "WhatsApp / Mobile": "",
        "Organisation & Location": "Property Expo | Mumbai, India",
        "Assigned Rep": "",
        "Pipeline Outcome": "Interested",
        "Campaign / Project": "Eden Park",
        "Follow-up Comments": "Collected a brochure but provided neither email nor mobile; this row should be skipped",
        "Possession Preference": "Not specified"
      },
      "reason": "Missing email and mobile number"
    }
  ]
}
```

> [!NOTE]
> AI output can vary slightly between models or runs while still satisfying the response schema.

## Run with Docker

Build and run the included standalone image:

```bash
docker build -f Dockerfile.vercel -t grow-easy-next .
docker run --rm --env-file .env -p 3000:3000 grow-easy-next
```

The image uses a multi-stage Node.js 22 Alpine build and reads AI credentials only when the container starts.

## Project structure

```text
src/
├── app/                 # App Router pages and layout
├── components/          # CSV workflow and UI components
├── pages/api/           # Next.js entry point for the Express API
├── server/
│   ├── ai/              # Prompt, provider, schemas, and batched extraction
│   ├── csv/             # Server-side CSV parsing
│   └── routes/          # Import endpoint
└── stores/              # Session-persisted import results
```

The backend is stateless and does not require a database. Imported results are retained in browser `sessionStorage` until reset or the session ends.
