# WeatherSync Agent API

An intelligent, AI-powered weather assistant built with Node.js and the Mastra framework. This service provides real-time weather information through a conversational API endpoint, leveraging Google's Gemini model for natural language understanding and interaction.

## ✨ Features

-   **Intelligent Agent**: Utilizes a Mastra-powered AI agent capable of understanding natural language queries about weather.
-   **Real-Time Data**: Integrates with the Open-Meteo API to fetch accurate, up-to-the-minute weather and geocoding data.
-   **Tool-Enabled**: The agent uses a dedicated `weatherTool` to ensure data accuracy, never guessing or hallucinating information.
-   **JSON-RPC Compliant**: Exposes a standardized API endpoint for easy integration and predictable interactions.
-   **In-Memory State**: Uses LibSQL for fast, in-memory conversation and session management.

## 🛠️ Technologies Used

| Technology                                                 | Description                                |
| ---------------------------------------------------------- | ------------------------------------------ |
| [Node.js](https://nodejs.org/)                             | JavaScript runtime environment             |
| [Mastra](https://www.mastra.io/)                           | Framework for building AI agents and tools |
| [Google Gemini](https://ai.google.dev/)                    | Core Large Language Model (LLM)            |
| [Zod](https://zod.dev/)                                    | Schema declaration and validation          |
| [LibSQL](https://turso.tech/)                              | In-memory database for session storage     |
| [Open-Meteo API](https://open-meteo.com/)                  | Source for weather and geocoding data      |

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or higher)
-   npm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/U22099/HNG-Backend-Task-4.git
    cd HNG-Backend-Task-4
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root of the project and add the following variable. You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```env
    GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY"
    ```

### Running the Application

Start the development server using the Mastra CLI:

```bash
npm run dev
```

The server will start, and the API will be available at `http://localhost:4000`.

---

## API Documentation

### Base URL

`http://localhost:4000`

### Endpoints

#### POST /a2a/agent/:agentId

Interacts with a specified AI agent. The `agentId` for the weather assistant is `weatherAgent`. The endpoint expects a JSON-RPC 2.0 compliant request body.

**Request**:

```json
{
  "jsonrpc": "2.0",
  "id": "req-12345",
  "method": "generate",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "What's the weather like in Paris?"
        }
      ]
    }
  }
}
```

**Response**:

A successful response returns a task object containing the agent's generated message, artifacts (including tool results), and conversation history.

```json
{
    "jsonrpc": "2.0",
    "id": "req-12345",
    "result": {
        "id": "a6f8b1c1-c9d3-4e4a-9b7e-9f3b3a6c8e1a",
        "contextId": "b2c3d4e5-e5f6-4a3b-8c7d-8e9f0a1b2c3d",
        "status": {
            "state": "completed",
            "timestamp": "2024-07-28T10:30:00.123Z",
            "message": {
                "messageId": "c3d4e5f6-f6a7-4b2c-9d8e-9f0a1b2c3d4e",
                "role": "agent",
                "parts": [
                    {
                        "kind": "text",
                        "text": "In Paris: Partly cloudy, 22.5°C (feels like 21.8°C), Humidity 65%, Wind 12.6 km/h"
                    }
                ],
                "kind": "message"
            }
        },
        "artifacts": [
            {
                "artifactId": "d4e5f6a7-a7b8-4c3d-a8e9-0f1a2b3c4d5e",
                "name": "weatherAgentResponse",
                "parts": [
                    {
                        "kind": "text",
                        "text": "In Paris: Partly cloudy, 22.5°C (feels like 21.8°C), Humidity 65%, Wind 12.6 km/h"
                    }
                ]
            },
            {
                "artifactId": "e5f6a7b8-b8c9-4d4e-b9f0-1a2b3c4d5e6f",
                "name": "ToolResults",
                "parts": [
                    {
                        "kind": "data",
                        "data": {
                            "toolId": "get-weather",
                            "status": "success",
                            "output": {
                                "temperature": 22.5,
                                "feelsLike": 21.8,
                                "humidity": 65,
                                "windSpeed": 12.6,
                                "conditions": "Partly cloudy",
                                "location": "Paris"
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
                "parts": [{ "kind": "text", "text": "What's the weather like in Paris?" }],
                "messageId": "f6a7b8c9-c9d0-4e5f-a0a1-2b3c4d5e6f7a",
                "taskId": "a6f8b1c1-c9d3-4e4a-9b7e-9f3b3a6c8e1a"
            },
            {
                "kind": "message",
                "role": "agent",
                "parts": [
                    {
                        "kind": "text",
                        "text": "In Paris: Partly cloudy, 22.5°C (feels like 21.8°C), Humidity 65%, Wind 12.6 km/h"
                    }
                ],
                "messageId": "c3d4e5f6-f6a7-4b2c-9d8e-9f0a1b2c3d4e",
                "taskId": "a6f8b1c1-c9d3-4e4a-9b7e-9f3b3a6c8e1a"
            }
        ],
        "kind": "task"
    }
}
```

**Errors**:

-   `400 Bad Request`: The request is not a valid JSON-RPC 2.0 request (e.g., `jsonrpc` is not "2.0" or `id` is missing).
-   `404 Not Found`: The requested `agentId` (e.g., `weatherAgent`) could not be found on the server.
-   `500 Internal Server Error`: An unexpected error occurred while the agent was processing the request. The response body may contain additional details.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvement or want to fix a bug, please feel free to open an issue or submit a pull request.

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Connect with the author:

-   **Twitter**: [@dan_22099](https://twitter.com/dan_22099)

<br/>

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)