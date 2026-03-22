# Webhook Pipeline Service

A webhook-driven task processing pipeline with background jobs and delivery retries. Incoming webhooks are queued, processed by a worker, and forwarded to subscriber endpoints.

## Features

- Pipelines with a unique source URL, action type, and subscribers
- Webhook ingestion that queues jobs (async processing)
- Background worker with retry + exponential backoff
- Job and delivery history APIs
- Docker Compose setup (API + worker + Postgres)
- GitHub Actions CI build

## Quick Start

### Docker (recommended)

```bash
docker compose up --build
```

Open the UI:

```
http://localhost:3000/
```

### Local Dev

```bash
npm install
npm run dev
```

In another terminal:

```bash
npm run dev:worker
```

## API Endpoints

### Pipelines

- `GET /pipelines`
- `GET /pipelines/:id`
- `POST /pipelines`
- `PATCH /pipelines/:id`
- `DELETE /pipelines/:id`

Example create:

```json
{
  "name": "Uppercase Alerts",
  "source_url": "alerts-1",
  "action_type": "uppercase"
}
```

### Subscribers

- `POST /subscribers`
- `GET /subscribers`
- `DELETE /subscribers/:id`

Example add:

```json
{
  "pipelineId": 1,
  "subscriberUrl": "https://webhook.site/your-id"
}
```

### Webhooks

- `POST /webhook/:sourceUrl`

Example payload:

```json
{
  "message": "hello from ui",
  "value": 99
}
```

### Jobs

- `GET /jobs`
- `GET /jobs/:id`
- `GET /jobs/:id/deliveries`

### Deliveries

- `GET /deliveries`

## Processing Actions

- `uppercase` – converts `message` to uppercase
- `add_timestamp` – adds `processed_at` ISO string
- `filter` – only forwards payloads where `value > 50` (else job is marked `skipped`)

## How to Test

You can use tools like curl or Postman to send webhook requests.

## Example Scenarios

### Scenario 1: Uppercase + Retry Failure

1. Create pipeline `Uppercase Alerts` with `source_url = alerts-1` and action `uppercase`.
2. Add a subscriber using your `webhook.site` URL.
3. Add a failing subscriber: `https://httpstat.us/500`
4. Send webhook to `/webhook/alerts-1` with:

```json
{ "message": "hello from ui", "value": 99 }
```

Expected:
- Job completes.
- One delivery succeeds.
- One delivery fails after 3 attempts.

### Scenario 2: Filter (Skipped + Pass)

1. Create pipeline `Filter Low Values` with action `filter`.
2. Add a webhook.site subscriber.
3. Send:

```json
{ "message": "too low", "value": 10 }
```

Expected:
- Job status `skipped`
- No deliveries

4. Send:

```json
{ "message": "big enough", "value": 80 }
```

Expected:
- Job completes
- Delivery succeeds

## Architecture Notes

- Jobs are claimed using a DB transaction with row locks to prevent double-processing.
- Worker polls every 5 seconds.
- Deliveries are retried up to 3 times with exponential backoff.

## CI

GitHub Actions runs a build on every push and pull request:

- Install dependencies
- TypeScript build

## Design Decisions

- Simple queue using Postgres rows for transparency and quick iteration.
- Worker separated from API for reliability and scaling.
- JSON payloads stored in `jobs.payload` for flexible processing.

## Author

Alaa Dere