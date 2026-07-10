# GrowEasy CSV Importer

AI-powered CSV importer that previews arbitrary CSV files and maps confirmed rows into GrowEasy CRM records.

## Requirements

- Docker, or Node.js 22 and npm
- An OpenAI-compatible API key

## Environment

Create the local environment file:

```bash
cp .env.example .env
```

Set these values in `.env`:

```dotenv
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=your-model-name
# Optional for OpenAI-compatible providers:
OPENAI_BASE_URL=https://api.openai.com/v1
```

## Deploy the Docker container on Vercel

Vercel automatically detects `Dockerfile.vercel` at the repository root. Import the repository in Vercel, then add these project environment variables for Production and Preview:

```dotenv
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=your-model-name
OPENAI_BASE_URL=https://api.openai.com/v1
PORT=3000
```

`OPENAI_BASE_URL` is optional. Deploy by pushing the repository or with the Vercel CLI:

```bash
vercel
vercel --prod
```

The `PORT` setting tells Vercel to route traffic to the non-root Next.js server on port 3000. The image uses a multi-stage build and reads AI credentials only when the container starts.

## Run the container locally

```bash
docker build -f Dockerfile.vercel -t grow-easy-next .
docker run --rm --env-file .env -p 3000:3000 grow-easy-next
```

Open [http://localhost:3000](http://localhost:3000).

## Run locally

```bash
npm ci
npm run dev
```

## API

Upload a CSV as multipart form data under the `file` field:

```bash
curl -X POST \
  -F "file=@public/sample.csv;type=text/csv" \
  http://localhost:3000/api/import
```

The response contains `records` with extracted CRM data and `skippedRecords` for rows without an email address or mobile number.
