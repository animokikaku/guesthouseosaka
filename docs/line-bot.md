# LINE Bot for Room Availability

Managers update rooms by messaging the house's LINE Official Account instead of opening the Studio:

> オレンジ 106 11月27日から空室
>
> Lemon 203 occupied, Apple 201 free now

The bot answers with what changed (`オレンジハウス 106号室：入居中 → 11月27日から空室`), in the language of the message.

## How It Works

`app/api/line/route.ts` receives LINE's webhook:

1. Checks the `x-line-signature` header against the channel secret and answers `200` right away; the rest runs in `after()`
2. Ignores senders that aren't in `LINE_ALLOWED_USER_IDS`, replying with their user ID so they can be added
3. Sends the message, today's date in Osaka and the houses' names and room numbers to [Agent Actions Prompt](https://www.sanity.io/docs/agent-actions/prompt-quickstart), which returns `{ language, updates: [{ house, room, availableFrom }] }`
4. Checks the answer against the houses (`lib/room-updates.ts`): rooms that don't exist are reported back, never created
5. Sets or unsets `availableFrom` on the published house in one transaction, and on its draft too if it has one, so publishing the draft later doesn't undo the update. Sanity Live then refreshes the page
6. Replies with a reply token, which is free on every LINE plan

Each message costs 1 Sanity AI credit. The Free plan includes 1,000 a month.

## Setup

1. Create a LINE Official Account, then enable the Messaging API in its settings. This creates a channel in the [LINE Developers console](https://developers.line.biz/console/)
2. In the console, copy the **Channel secret** (Basic settings) and issue a **Channel access token** (Messaging API)
3. In [sanity.io/manage](https://www.sanity.io/manage), create a project API token with the **Editor** role
4. Set `LINE_CHANNEL_SECRET`, `LINE_CHANNEL_ACCESS_TOKEN` and `SANITY_API_WRITE_TOKEN` in Vercel for Production, and redeploy
5. Back in the console, set the webhook URL to `https://guesthouseosaka.com/api/line`, turn on **Use webhook** and click **Verify**. Preview deployments sit behind Vercel Authentication, so LINE can only reach production
6. In the LINE Official Account Manager, turn off the auto-reply messages so they don't answer alongside the bot
7. Have each manager add the account as a friend and send any message. The bot replies with their user ID: add it to `LINE_ALLOWED_USER_IDS` (comma-separated) and redeploy

The route answers `503` until the secret, the access token and the write token are all set.

## Local Testing

LINE can't reach `localhost`, so sign a webhook body yourself with the secret the dev server uses:

```bash
body='{"events":[{"type":"message","replyToken":"test","source":{"type":"user","userId":"U123"},"message":{"type":"text","text":"Lemon 202 free from Dec 3"}}]}'
sig=$(printf '%s' "$body" | openssl dgst -sha256 -hmac "$LINE_CHANNEL_SECRET" -binary | base64)
curl -X POST http://localhost:3000/api/line -H "x-line-signature: $sig" --data-binary "$body"
```

The reply itself fails with a fake reply token (LINE answers `400`), which the server logs. With a real `SANITY_API_WRITE_TOKEN`, the update is written to the dataset in `NEXT_PUBLIC_SANITY_DATASET`.
