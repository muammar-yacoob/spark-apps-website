# Bottled API Reference

**Base URL**: `https://bottled.email/api/v1`

**Authentication**: Include `Authorization: Bearer btl_YOUR_API_KEY` header on all requests. API keys are per-domain, prefixed `btl_`, and shown once when generated in Dashboard > API.

## Quick Start

```bash
# Check your account status
curl https://bottled.email/api/v1/status \
  -H "Authorization: Bearer btl_YOUR_API_KEY"

# List your domains
curl https://bottled.email/api/v1/domains \
  -H "Authorization: Bearer btl_YOUR_API_KEY"

# Send an email
curl -X POST https://bottled.email/api/v1/send \
  -H "Authorization: Bearer btl_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@example.com",
    "to": "recipient@example.com",
    "subject": "Hello",
    "text": "Hi there"
  }'
```

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/status` | Account status and current usage |
| `GET` | `/domains` | List all domains |
| `GET` | `/domains/:name` | Get domain details |
| `POST` | `/domains/:name` | Verify domain DNS records |
| `GET` | `/emails` | List email addresses |
| `POST` | `/emails` | Create new email address |
| `POST` | `/send` | Send email (individual) |

---

## GET /status

Returns account plan, status, and current month usage.

**Example**:
```bash
curl https://bottled.email/api/v1/status \
  -H "Authorization: Bearer btl_YOUR_API_KEY"
```

**Response**:
```json
{
  "data": {
    "status": "active",
    "plan": "free",
    "usage": {
      "sent": { "used": 5, "limit": 25, "remaining": 20 },
      "received": { "used": 12, "limit": 100, "remaining": 88 }
    },
    "period": {
      "start": "2026-03-01T00:00:00.000Z",
      "end": "2026-03-31T23:59:59.999Z"
    }
  }
}
```

`limit` and `remaining` are `null` on unlimited plans.

---

## GET /domains

List all verified and unverified domains for your account.

**Example**:
```bash
curl https://bottled.email/api/v1/domains \
  -H "Authorization: Bearer btl_YOUR_API_KEY"
```

**Response**:
```json
{
  "data": {
    "domains": [
      {
        "domain": "example.com",
        "verified": true,
        "verifiedCloudflare": true,
        "verifiedSes": true,
        "createdAt": "2026-03-10T15:30:00.000Z"
      }
    ]
  }
}
```

---

## GET /domains/:name

Get details for a specific domain.

**Path Parameters**:
- `name` (string) - Domain name, e.g., `example.com`

**Example**:
```bash
curl https://bottled.email/api/v1/domains/example.com \
  -H "Authorization: Bearer btl_YOUR_API_KEY"
```

**Response**: Same as single domain object from `GET /domains`

---

## POST /domains/:name

Trigger DNS verification for a domain. Checks both Cloudflare and SES status.

**Path Parameters**:
- `name` (string) - Domain name

**Example**:
```bash
curl -X POST https://bottled.email/api/v1/domains/example.com \
  -H "Authorization: Bearer btl_YOUR_API_KEY"
```

**Response**:
```json
{
  "data": {
    "domain": "example.com",
    "verified": true,
    "verifiedCloudflare": true,
    "verifiedSes": true,
    "message": "Domain fully verified"
  }
}
```

---

## GET /emails

List email addresses, optionally filtered by domain.

**Query Parameters**:
- `domainName` (string, optional) - Filter by domain name

**Examples**:
```bash
# List all email addresses
curl https://bottled.email/api/v1/emails \
  -H "Authorization: Bearer btl_YOUR_API_KEY"

# Filter by domain
curl "https://bottled.email/api/v1/emails?domainName=example.com" \
  -H "Authorization: Bearer btl_YOUR_API_KEY"
```

**Response**:
```json
{
  "data": {
    "emails": [
      {
        "fullAddress": "hello@example.com",
        "displayName": "Hello",
        "domainName": "example.com",
        "forwardTo": "inbox@gmail.com",
        "isActive": true,
        "createdAt": "2026-03-10T15:30:00.000Z"
      }
    ]
  }
}
```

---

## POST /emails

Create a new email address.

**Example**:
```bash
curl -X POST https://bottled.email/api/v1/emails \
  -H "Authorization: Bearer btl_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domainName": "example.com",
    "address": "hello",
    "forwardTo": "inbox@gmail.com"
  }'
```

**Request Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `domainName` | string | yes | Must be a verified domain |
| `address` | string | yes | Local part only (e.g., `hello`) |
| `forwardTo` | string | yes | Destination personal email address |

**Response** (201):
```json
{
  "data": {
    "fullAddress": "hello@example.com",
    "displayName": "Hello",
    "domainName": "example.com",
    "forwardTo": "inbox@gmail.com",
    "isActive": true,
    "cloudflareConfigured": true,
    "createdAt": "2026-03-10T15:30:00.000Z"
  }
}
```

---

## POST /send

Send an email from one of your verified addresses.

### Individual Send

Send to a single recipient by email address.

**Examples**:
```bash
# Send plain text email
curl -X POST https://bottled.email/api/v1/send \
  -H "Authorization: Bearer btl_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@example.com",
    "to": "recipient@example.com",
    "subject": "Hello",
    "text": "Hi there"
  }'

# Send HTML email with reply-to
curl -X POST https://bottled.email/api/v1/send \
  -H "Authorization: Bearer btl_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@example.com",
    "to": "recipient@example.com",
    "subject": "Newsletter",
    "html": "<p>Check out our latest news</p>",
    "replyTo": "support@example.com"
  }'
```

**Request Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `from` | string | yes | Must be a verified email address |
| `to` | string | yes | Recipient email — validated for syntax, role-address denylist, and MX record before send. Returns `INVALID_RECIPIENT` (422) on failure. |
| `subject` | string | yes | Max 998 characters |
| `text` | string | conditional | At least one of `text`/`html` required |
| `html` | string | conditional | At least one of `text`/`html` required |
| `replyTo` | string | no | Reply-to address |

**Response** (200):
```json
{
  "data": {
    "id": 42,
    "messageId": "<abc123@email.amazonses.com>",
    "from": "hello@example.com",
    "to": "recipient@example.com",
    "subject": "Hello",
    "status": "sent",
    "sentAt": "2026-03-10T15:30:00.000Z"
  }
}
```

### Group Send (Dashboard only)

Send to all members of a team group. Available via the dashboard compose UI or the internal session-authenticated `/api/send` endpoint. Not available via API key auth.

**Request Fields** (internal `/api/send`):
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fromAddress` | string | yes | Must be a verified email address |
| `groupId` | number | yes | ID of the target team group |
| `subject` | string | yes | Max 998 characters |
| `text` | string | conditional | At least one of `text`/`html` required |
| `html` | string | conditional | At least one of `text`/`html` required |
| `replyTo` | string | no | Reply-to address |

The server resolves all members in the group, looks up their personal email (from assigned email forwarding address or login email), and sends to each unique recipient. Each send counts toward your plan's monthly limit.

**Response** (200):
```json
{
  "success": true,
  "sentCount": 5,
  "totalMembers": 6,
  "message": "Email sent to 5 of 6 group members",
  "partialErrors": ["failed@example.com: send failed"]
}
```

`partialErrors` is only present if some recipients failed. `sentCount` may be less than `totalMembers` in case of partial failures.

---

## Team & Groups (Dashboard only)

These endpoints are session-authenticated (not available via API key). They are used by the dashboard UI to manage workspace members and groups.

### Team Members

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/team` | List all workspace members (includes assigned emails, groups, invite status) |
| `POST` | `/api/team` | Create a new member (auto-generates password, sends invite) |
| `PATCH` | `/api/team/:memberId` | Update member (name, avatar, assigned emails) |
| `DELETE` | `/api/team/:memberId` | Remove a member |
| `POST` | `/api/team/:memberId/invite` | Resend invite email |
| `POST` | `/api/team/:memberId/reset-link` | Send password reset link |
| `POST` | `/api/team/:memberId/groups` | Set member's group memberships |

### Team Groups

Groups are emoji-tagged categories for organizing team members (e.g., Dev, Art, Marketing). Default groups are seeded on first access.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/team/groups` | List all groups (seeds defaults on first call) |
| `POST` | `/api/team/groups` | Create a custom group |
| `PATCH` | `/api/team/groups/:groupId` | Update group (name, emoji, color) |
| `DELETE` | `/api/team/groups/:groupId` | Delete a group |

**Group Object**:
```json
{
  "id": 1,
  "name": "Dev",
  "emoji": "\uD83D\uDCBB",
  "color": "#3b82f6",
  "isDefault": true,
  "memberCount": 3
}
```

**Create Group** (`POST /api/team/groups`):
```json
{
  "name": "QA",
  "emoji": "\uD83D\uDD0D",
  "color": "#10b981"
}
```

**Set Member Groups** (`POST /api/team/:memberId/groups`):
```json
{
  "groupIds": [1, 3, 5]
}
```

Replaces all existing group memberships for the member.

**Default Groups** (seeded automatically):

| Name | Emoji | Color |
|------|-------|-------|
| Dev | `💻` | `#3b82f6` (blue) |
| Art | `🎨` | `#f59e0b` (amber) |
| Marketing | `📢` | `#ec4899` (pink) |
| Sales | `💰` | `#22c55e` (green) |
| HR | `🤝` | `#8b5cf6` (violet) |
| Support | `🎧` | `#06b6d4` (cyan) |
| Design | `✏️` | `#f97316` (orange) |
| Management | `👔` | `#64748b` (slate) |

---

## Plan Limits

All API requests are subject to your plan's limits. Check `GET /status` to monitor current usage:

| Plan | Domains | Emails/Domain | Sent/Month | Received/Month | API Access |
|------|---------|---------------|------------|----------------|------------|
| Free | 1 | 2 | 25 | 100 | Yes |
| Pro | 3 | 10 | 300 | 1,000 | Yes |
| Business | 15 | 50 | 5,000 | 10,000 | Yes |

Group sends count each individual recipient toward your monthly send limit (e.g., sending to a group of 5 uses 5 sends).

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}
```

| Code | Status | Meaning |
|------|--------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `NOT_FOUND` | 404 | Domain or resource not found |
| `ALREADY_EXISTS` | 409 | Email address already exists |
| `DOMAIN_NOT_FOUND` | 404 | Domain doesn't belong to your account |
| `LIMIT_EXCEEDED` | 403 | Plan limit reached (domains or emails per domain) |
| `SEND_LIMIT_REACHED` | 429 | Monthly send quota exceeded |
| `INVALID_RECIPIENT` | 422 | Recipient address is undeliverable (bad syntax, role address like `postmaster@`, or domain has no MX records). Check for typos. |
| `DOMAIN_WARMUP_LIMIT` | 429 | Sending domain is still in its first-week warmup window and has hit the daily cap. Lifts automatically as the domain ages. See [Plans](./plans.md#new-domain-warmup) for the ramp schedule. |
| `MISSING_BODY` | 400 | Email body required (text or html) |
| `NO_GROUP_MEMBERS` | 400 | Group has no members to send to |
| `INTERNAL_ERROR` | 500 | Server error |

---

## HTML Email Formatting Guide

Bottled automatically wraps your HTML in an email-safe shell with a proper DOCTYPE, email client resets, Outlook VML fixes, and a centered 600px table layout. You only need to provide the **body content** — no `<html>`, `<head>`, or `<body>` tags.

The wrapper gives you:
- XHTML 1.0 Transitional DOCTYPE (required by Outlook desktop)
- Microsoft Office conditional comments for Outlook rendering
- Client resets for Gmail, Yahoo, Outlook.com (`.ReadMsgBody`, `.ExternalClass`)
- Auto-detection suppression (iOS won't auto-link phone numbers, dates, addresses)
- System font stack: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif`
- 600px max-width centered layout with `16px 24px` padding
- Base text: `15px`, line-height `1.6`, color `#1a1a1a`

### Rules for cross-client HTML

1. **Use tables for layout** — `<div>` positioning breaks in Outlook desktop
2. **Inline all styles** — most clients strip `<style>` blocks; always use `style="..."` on each element
3. **No `<div>` for spacing** — use `padding` on `<td>` elements instead
4. **No CSS shorthand** — write `padding-top:12px;padding-bottom:12px;` not `padding:12px 0`
5. **No `background-image`** — Outlook ignores it; use `background-color` only
6. **Set `width` on `<table>` and `<td>`** — don't rely on percentages alone; Outlook needs explicit values
7. **Images need explicit `width`/`height`** — prevents layout shifts; use `style="display:block"` to remove gaps
8. **Use `align="center"` on tables** — not `margin:0 auto` (Outlook ignores margin on tables)
9. **Always include `text`** alongside `html` — plain-text fallback improves deliverability and spam scores
10. **No JavaScript, `<form>`, `<video>`, `<iframe>`** — stripped by all major clients
11. **Use `role="presentation"` on layout tables** — improves accessibility for screen readers

### Template: Simple Text Email

For plain messages with basic formatting. The wrapper handles fonts and layout — you just provide content.

```bash
curl -X POST https://bottled.email/api/v1/send \
  -H "Authorization: Bearer btl_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "updates@yourapp.com",
    "to": "user@example.com",
    "subject": "Your weekly summary",
    "text": "Hi Alex,\n\nHere is your weekly summary:\n- 12 tasks completed\n- 3 new comments\n\nThanks,\nYourApp",
    "html": "<p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#1a1a1a;\">Hi Alex,</p><p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#1a1a1a;\">Here is your weekly summary:</p><ul style=\"margin:0 0 16px;padding-left:20px;color:#1a1a1a;\"><li style=\"margin-bottom:6px;\">12 tasks completed</li><li style=\"margin-bottom:6px;\">3 new comments</li></ul><p style=\"margin:0;font-size:15px;line-height:1.6;color:#1a1a1a;\">Thanks,<br/>YourApp</p>"
  }'
```

### Template: Styled Card with CTA Button

A modern card layout with a header accent, content section, and call-to-action button. Works in Gmail, Outlook, Apple Mail, and Yahoo.

```json
{
  "from": "hello@yourapp.com",
  "to": "user@example.com",
  "subject": "You have a new message",
  "text": "Hi Alex,\n\nYou received a new message from Jamie.\n\nView message: https://yourapp.com/messages/42\n\nThanks,\nYourApp",
  "html": "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='border-collapse:collapse;'><tr><td style='height:4px;background-color:#4bbecf;font-size:0;line-height:0;'>&nbsp;</td></tr><tr><td style='background-color:#f9fafb;padding:28px 24px;'><h1 style='margin:0 0 8px;font-size:20px;font-weight:700;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>New message</h1><p style='margin:0;font-size:14px;color:#666666;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>from Jamie</p></td></tr><tr><td style='padding:0 24px;'><table width='100%' border='0' cellpadding='0' cellspacing='0'><tr><td style='border-top:1px solid #e5e7eb;font-size:0;line-height:0;'>&nbsp;</td></tr></table></td></tr><tr><td style='padding:24px;'><p style='margin:0 0 20px;font-size:15px;line-height:1.6;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Hi Alex,</p><p style='margin:0 0 24px;font-size:15px;line-height:1.6;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>You received a new message from <strong>Jamie</strong>. Click below to view and reply.</p><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='center' style='padding:4px 0 16px;'><!--[if mso]><v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" href=\"https://yourapp.com/messages/42\" style=\"height:44px;v-text-anchor:middle;width:200px;\" arcsize=\"18%\" fillcolor=\"#4bbecf\" stroke=\"f\"><w:anchorlock/><center style=\"color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:15px;font-weight:bold;\">View Message</center></v:roundrect><![endif]--><!--[if !mso]><!--><a href='https://yourapp.com/messages/42' style='display:inline-block;padding:12px 28px;background-color:#4bbecf;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'><span style='color:#ffffff;'>View Message</span></a><!--<![endif]--></td></tr></table></td></tr><tr><td style='padding:16px 24px 24px;'><p style='margin:0;font-size:12px;line-height:1.5;color:#999999;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>If the button doesn&#39;t work, copy this link: https://yourapp.com/messages/42</p></td></tr></table>"
}
```

**What this renders:**
- Cyan accent bar at the top (4px, `#4bbecf`)
- Light gray header with title and subtitle
- Divider line
- Body text with a rounded CTA button
- Outlook-safe VML fallback button (Outlook ignores `border-radius` on `<a>`)
- Plain-text link fallback below the button

### Template: Info Card with Icon Row

A status notification with inline icon and metadata row. Good for alerts, receipts, and confirmations.

```json
{
  "from": "alerts@yourapp.com",
  "to": "user@example.com",
  "subject": "Payment received — $49.00",
  "text": "Payment received\n\nAmount: $49.00\nPlan: Pro\nDate: Apr 27, 2026\nReceipt: https://yourapp.com/receipts/1234\n\nThanks for your support!\nYourApp",
  "html": "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='border-collapse:collapse;background-color:#f0fdf4;border-radius:8px;'><tr><td style='padding:20px 24px;'><table role='presentation' cellpadding='0' cellspacing='0' border='0'><tr><td style='vertical-align:middle;padding-right:12px;font-size:24px;'>&#10003;</td><td style='vertical-align:middle;'><p style='margin:0;font-size:16px;font-weight:700;color:#166534;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Payment received</p></td></tr></table></td></tr></table><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='border-collapse:collapse;margin-top:20px;'><tr><td style='padding:12px 0;border-bottom:1px solid #e5e7eb;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='font-size:13px;color:#666666;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;' width='100'>Amount</td><td style='font-size:15px;font-weight:600;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>$49.00</td></tr></table></td></tr><tr><td style='padding:12px 0;border-bottom:1px solid #e5e7eb;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='font-size:13px;color:#666666;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;' width='100'>Plan</td><td style='font-size:15px;font-weight:600;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Pro</td></tr></table></td></tr><tr><td style='padding:12px 0;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='font-size:13px;color:#666666;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;' width='100'>Date</td><td style='font-size:15px;font-weight:600;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Apr 27, 2026</td></tr></table></td></tr></table><p style='margin:20px 0 0;font-size:15px;line-height:1.6;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Thanks for your support!</p>"
}
```

**What this renders:**
- Green success banner with checkmark and "Payment received"
- Clean key-value rows with dividers (Amount, Plan, Date)
- All table-based — renders identically in Outlook and Gmail

### Template: Multi-Section Newsletter

A newsletter layout with multiple content blocks separated by dividers.

```json
{
  "from": "news@yourapp.com",
  "to": "subscriber@example.com",
  "subject": "This week at YourApp",
  "text": "This week at YourApp\n\nNew Feature: Dark Mode\nWe shipped dark mode across all pages.\n\nTip of the Week\nUse keyboard shortcut Cmd+K to open the command palette.\n\nRead more: https://yourapp.com/blog",
  "html": "<h1 style='margin:0 0 24px;font-size:22px;font-weight:700;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>This week at YourApp</h1><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='margin-bottom:24px;'><tr><td style='padding-bottom:12px;'><p style='margin:0 0 4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#4bbecf;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>New Feature</p><p style='margin:0 0 8px;font-size:17px;font-weight:700;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Dark Mode</p><p style='margin:0;font-size:15px;line-height:1.6;color:#444444;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>We shipped dark mode across all pages. Your eyes will thank you.</p></td></tr></table><table width='100%' border='0' cellpadding='0' cellspacing='0'><tr><td style='border-top:1px solid #e5e7eb;font-size:0;line-height:0;padding-bottom:24px;'>&nbsp;</td></tr></table><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='margin-bottom:24px;'><tr><td style='padding-bottom:12px;'><p style='margin:0 0 4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#4bbecf;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Tip of the Week</p><p style='margin:0 0 8px;font-size:17px;font-weight:700;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Command Palette</p><p style='margin:0;font-size:15px;line-height:1.6;color:#444444;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Use <strong>Cmd+K</strong> to open the command palette and navigate anywhere instantly.</p></td></tr></table><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='center' style='padding-top:8px;'><a href='https://yourapp.com/blog' style='font-size:14px;color:#4bbecf;text-decoration:none;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'>Read more on our blog &rarr;</a></td></tr></table>"
}
```

### Spam-safe formatting tips

Avoid patterns that spam filters penalize:

| Do | Don't |
|----|-------|
| Use `text` + `html` together | Send `html` only (missing plain-text hurts spam score) |
| Use `#4bbecf` or muted brand colors | Use bright red `#ff0000` or all-caps colored text |
| Keep image-to-text ratio low | Send image-only emails with no text |
| Use one or two links | Stuff dozens of links or use link shorteners |
| Write a clear `subject` | Use ALL CAPS, excessive punctuation (!!!), or spam trigger words |
| Set a real `from` address | Use `noreply@` (reduces engagement, flags filters) |
| Include a plain-text link fallback below CTA buttons | Rely only on the HTML button |

---

## Best Practices

- **Check status regularly**: Use `GET /status` before high-volume sending to ensure you won't hit limits
- **Verify domains first**: Ensure domains are fully verified before creating email addresses
- **Handle rate limits**: Respect `429` responses and retry with exponential backoff
- **Store API keys securely**: Never commit API keys to version control; use environment variables
- **Group sends**: Each recipient in a group send counts individually toward your monthly limit — check `GET /status` before sending to large groups
- **Always send both `text` and `html`**: Plain-text fallback improves deliverability and spam scores
- **Test with your own inbox**: Send to yourself first to verify formatting before sending to real recipients
- **Use SES simulator for load testing**: Send to `success@simulator.amazonses.com` for volume tests without reputation impact
