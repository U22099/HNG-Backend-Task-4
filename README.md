# Mastra Time Agent API

## Overview
This project is a Node.js API server built with the Mastra framework. It exposes a smart scheduling assistant (Time Agent) powered by Google's Gemini model through an A2A (Agent-to-Agent) compliant JSON-RPC endpoint.

## Features
- **Mastra Framework**: Provides the core structure for building, managing, and deploying AI agents.
- **Google Gemini**: The underlying language model used for natural language understanding and generating scheduling suggestions.
- **A2A Protocol**: Implements a standardized Agent-to-Agent communication protocol over a JSON-RPC 2.0 interface.
- **Timezone-Aware Scheduling**: Features a dedicated tool (`time-finder`) to calculate and suggest overlapping meeting slots across different timezones.

## Getting Started
### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/hng-backend-task-4.git
    cd hng-backend-task-4
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your environment variables (e.g., `http://localhost:3000`).

### Environment Variables
Create a `.env` file in the root directory and add the following variables. These are required for the application to function correctly.

| Variable          | Description                                    | Example                          |
| ----------------- | ---------------------------------------------- | -------------------------------- |
| `PORT`            | The port on which the server will run.         | `3000`                           |
| `GOOGLE_API_KEY`  | Your API key for the Google Gemini model.      | `AIzaSyB...`                     |

## API Documentation
### Base URL
The API base URL will depend on your environment. For local development, it is typically:
`http://localhost:3000`

### Endpoints
#### POST /a2a/agent/:agentId
Executes a task on the specified agent using the A2A JSON-RPC 2.0 protocol. The `:agentId` should correspond to an agent registered in the Mastra instance (e.g., `timeAgent`).

**Request**:
The request body must be a valid JSON-RPC 2.0 object. The `params` object should contain the message(s) to be sent to the agent.

*Payload Structure:*
```json
{
  "jsonrpc": "2.0",
  "id": "request-unique-id-123",
  "method": "executeTask",
  "params": {
    "taskId": "task-unique-id-456",
    "contextId": "conversation-context-id-789",
    "messages": [
      {
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "Find a 30 minute meeting slot for me in America/New_York and someone in Europe/Berlin for tomorrow"
          }
        ]
      }
    ]
  }
}
```

**Response**:
A successful response returns a JSON-RPC 2.0 object containing the agent's output, conversation history, and any generated artifacts.

*Success (200 OK) Response Example:*
```json
{
    "jsonrpc": "2.0",
    "id": "request-unique-id-123",
    "result": {
        "id": "task-unique-id-456",
        "contextId": "conversation-context-id-789",
        "status": {
            "state": "completed",
            "timestamp": "2024-07-28T10:30:00.000Z",
            "message": {
                "messageId": "msg-agent-response-1",
                "role": "agent",
                "parts": [
                    {
                        "kind": "text",
                        "text": "Of course! Here are the top 3 available slots for a 30-minute meeting tomorrow:\n- 9:00 AM EDT → 3:00 PM CEST\n- 10:00 AM EDT → 4:00 PM CEST\n- 11:00 AM EDT → 5:00 PM CEST"
                    }
                ],
                "kind": "message"
            }
        },
        "artifacts": [
            {
                "artifactId": "artifact-agent-response-1",
                "name": "timeAgentResponse",
                "parts": [
                    {
                        "kind": "text",
                        "text": "Of course! Here are the top 3 available slots for a 30-minute meeting tomorrow:\n- 9:00 AM EDT → 3:00 PM CEST\n- 10:00 AM EDT → 4:00 PM CEST\n- 11:00 AM EDT → 5:00 PM CEST"
                    }
                ]
            },
            {
                "artifactId": "artifact-tool-result-1",
                "name": "ToolResults",
                "parts": [
                    {
                        "kind": "data",
                        "data": {
                            "toolId": "find-meeting-slots",
                            "input": { "tz1": "America/New_York", "tz2": "Europe/Berlin", "duration": 30, "date": "tomorrow" },
                            "output": {
                                "slots": [
                                    { "America/New_York": "9:00 AM", "Europe/Berlin": "3:00 PM", "duration": 30, "utcStart": "..." },
                                    { "America/New_York": "10:00 AM", "Europe/Berlin": "4:00 PM", "duration": 30, "utcStart": "..." },
                                    { "America/New_York": "11:00 AM", "Europe/Berlin": "5:00 PM", "duration": 30, "utcStart": "..." }
                                ]
                            }
                        }
                    }
                ]
            }
        ],
        "history": [
            {
                "kind": "message",
                "role": "user",
                "parts": [{ "kind": "text", "text": "Find a 30 minute meeting slot for me in America/New_York and someone in Europe/Berlin for tomorrow" }],
                "messageId": "msg-user-1",
                "taskId": "task-unique-id-456"
            },
            {
                "kind": "message",
                "role": "agent",
                "parts": [{ "kind": "text", "text": "Of course! Here are the top 3 available slots for a 30-minute meeting tomorrow:\n- 9:00 AM EDT → 3:00 PM CEST\n- 10:00 AM EDT → 4:00 PM CEST\n- 11:00 AM EDT → 5:00 PM CEST" }],
                "messageId": "msg-agent-response-1",
                "taskId": "task-unique-id-456"
            }
        ],
        "kind": "task"
    }
}
```

**Errors**:
- `400 Bad Request`: The request payload is not a valid JSON-RPC 2.0 object.
  ```json
  {
      "jsonrpc": "2.0",
      "id": null,
      "error": {
          "code": -32600,
          "message": "Invalid Request: jsonrpc must be \"2.0\" and id is required"
      }
  }
  ```
- `404 Not Found`: The specified `:agentId` does not exist.
  ```json
  {
      "jsonrpc": "2.0",
      "id": "request-unique-id-123",
      "error": {
          "code": -32602,
          "message": "Agent 'nonExistentAgent' not found"
      }
  }
  ```
- `500 Internal Server Error`: An unexpected error occurred on the server.
  ```json
  {
      "jsonrpc": "2.0",
      "id": null,
      "error": {
          "code": -32603,
          "message": "Internal error",
          "data": {
              "details": "Error message from the server."
          }
      }
  }
  ```