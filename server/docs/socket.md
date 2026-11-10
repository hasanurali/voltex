# WebSocket

## Overview

Voltex uses **Socket.IO** with WebSocket transport for real-time communication.

### Features

- Cookie-based socket authentication
- Online/offline presence
- Conversation rooms
- Typing indicators
- Real-time chat messages
- Real-time read receipts
- Real-time notifications
- Real-time block/unblock updates

## Authentication

Socket connections are authenticated using the access-token cookie.

The server verifies the JWT and attaches the authenticated user ID to the socket. Invalid or unauthenticated connections are rejected.

## Rooms

| Room | Purpose |
|---|---|
| `{userId}` | User-specific events such as notifications and block updates |
| `{conversationId}` | Conversation events such as messages and read receipts |
| `status:{userId}` | Online/offline presence |

Conversation membership is verified before joining a conversation room.

## Events

| Event | Direction | Client Payload | Server Payload | Description |
|---|---|---|---|---|
| `status:subscribe-users` | Client → Server | `string[]` user IDs | — | Subscribe to presence updates for the specified users. |
| `status:user-online` | Server → Client | — | `{ userId: string }` | Sends the user ID when that user becomes online. |
| `status:user-offline` | Server → Client | — | `{ userId: string }` | Sends the user ID when that user becomes offline. |
| `join:conversation` | Client → Server | `conversationId: string` | — | Validates membership and joins the conversation room. |
| `status:typing-start` | Client → Server → Clients | `conversationId: string` | `{ userId: string }` | Notifies other members that the user started typing. |
| `status:typing-stop` | Client → Server → Clients | `conversationId: string` | `{ userId: string }` | Notifies other members that the user stopped typing. |
| `chat:message-receive` | Server → Client | — | Message object | Delivers a new chat message. |
| `chat:messages-read` | Server → Client | — | `{ conversationId: string, readerId: string }` | Notifies the conversation room that a member read the messages. Emitted only when at least one message was marked as read. |
| `notification:receive` | Server → Client | — | Notification object | Delivers a new notification. |
| `block:changed` | Server → Client | — | `{ blockerId: string, isBlocked: boolean }` | Notifies a user that another user blocked (`true`) or unblocked (`false`) them. Sent to the affected user's `{userId}` room, so every open tab receives it. |

## Read Receipts

When a user marks a conversation as read, the server emits `chat:messages-read` to the conversation room after the database update, and only if at least one message changed. The reader's own clients also receive the event and ignore it by comparing `readerId` with the current user.

## Block Updates

When a user blocks or unblocks another user, the server emits `block:changed` to the affected user after the database write succeeds. Clients refetch the related profile, follow and conversation data instead of reading state from the event.

## Presence

Active socket connections are tracked using an in-memory connection counter, allowing multiple tabs or devices per user.

A user is considered offline only after their last active connection disconnects.

## Security

- JWT authentication using HTTP-only cookies
- Conversation membership validation
- ObjectId validation for room operations
- Restricted Socket.IO CORS
- Room membership validation for typing events

## Performance

High-frequency typing events do not perform database queries. Conversation authorization is checked when joining the room, then Socket.IO room membership is used for subsequent typing events.