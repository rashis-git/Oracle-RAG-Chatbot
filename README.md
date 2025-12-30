# Oracle Procurement and Expenses Agent

An AI-powered conversational interface designed to assist users with Oracle Procurement and Expenses queries. This application leverages a Retrieval-Augmented Generation (RAG) architecture to provide accurate, context-aware answers based on internal documentation.

## Project Summary

The core function of this agent is to answer specific queries related to Oracle Procurement and Expenses policies, procedures, and usage. It acts as an intelligent layer over a database of stored files, allowing users to ask natural language questions and receive precise answers derived from the actual documentation rather than hallucinated content.

## Architecture

The system is built using a modern frontend connected to an n8n workflow orchestration backend.

### Tech Stack
*   **Frontend:** React, Tailwind CSS, Glassmorphism UI
*   **Orchestration:** n8n
*   **Vector Database:** Pinecone
*   **AI/LLM:** Google Gemini (Embeddings & Text Generation)
*   **Document Storage:** Google Drive

## Workflows

The intelligence of the system is powered by two distinct n8n workflows:

### 1. Knowledge Base Ingestion (RAG Update)
This workflow ensures the agent has the latest information. It automates the process of reading documents and updating the vector database.

*   **Trigger:** Monitors a Google Drive folder for new files (`fileCreated`).
*   **Process:**
    1.  **Search & Download:** Locates the files in Google Drive and downloads them.
    2.  **Processing:** Uses a **Default Data Loader** to read the content and a **Recursive Character Text Splitter** to break documents into manageable chunks.
    3.  **Embedding:** Converts text chunks into vector embeddings using **Google Gemini**.
    4.  **Storage:** Upserts these vectors into the **Pinecone Vector Store**.

### 2. Chat Inference (Q&A)
This workflow handles the real-time interaction with the user.

*   **Trigger:** Receives a chat message via Webhook from this React application.
*   **Process:**
    1.  **Embedding:** Converts the user's natural language query into an embedding using **Google Gemini**.
    2.  **Retrieval:** Performs a semantic search in **Pinecone** to find the most relevant document chunks based on the query.
    3.  **Aggregation:** Combines the retrieved context.
    4.  **Generation:** Sends the user's query along with the retrieved context to the **Google Gemini Model**.
*   **Output:** Returns the generated, context-aware response to the web interface.

## Local Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
