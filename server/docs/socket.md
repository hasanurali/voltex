# WebSocket

## Overview

Voltex uses **Socket.IO** with WebSocket transport for real-time communication.

### Features

- Cookie-based socket authentication
- Online/offline presence
- Conversation rooms
- Typing indicators
- Real-time chat messages
- Real-time notifications

## Authentication

Socket connections are authenticated using the access-token cookie.

The server verifies the JWT and attaches the authenticated user ID to the socket. Invalid or unauthenticated connections are rejected.

## Rooms

| Room | Purpose |
|---|---|
| `{userId}` | User-specific events such as notifications |
| `{conversationId}` | Conversation events |
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
| `notification:receive` | Server → Client | — | Notification object | Delivers a new notification. |

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