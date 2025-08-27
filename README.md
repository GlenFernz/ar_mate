# Virtual AR Mate

This project is a "Virtual AR Mate" that uses a backend powered by FastAPI and a frontend built with React. The backend provides NLP capabilities, emotion detection, and real-time communication to interact with an AR model.

## Project Structure

The project is organized into two main directories:

-   `frontend/`: Contains the React-based frontend application.
-   `backend/`: Contains the FastAPI-based backend application.

## Backend Setup

### Prerequisites

-   Python 3.7+

### Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### Configuration

The backend requires API keys and credentials for the following services:

-   **OpenAI:** For GPT and Whisper APIs.
-   **Google Cloud:** For Text-to-Speech.
-   **Firebase:** For Firestore database.

Set the following environment variables:

```bash
export OPENAI_API_KEY="your_openai_api_key"
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/google_credentials.json"
export FIREBASE_SERVICE_ACCOUNT_KEY_PATH="path/to/your/firebase_service_account.json"
```

### Running the Backend

To run the backend server, use the following command from the `backend` directory:

```bash
uvicorn main:app --reload
```

The server will be available at `http://127.0.0.1:8000`.

## Frontend Setup

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm, yarn, or pnpm

### Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

### Running the Frontend

To run the frontend development server, use the following command from the `frontend` directory:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).
