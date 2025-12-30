import { WEBHOOK_URL } from '../constants';
import { WebhookResponse } from '../types';

export const sendMessageToN8n = async (message: string): Promise<string> => {
  try {
    const encodedMessage = encodeURIComponent(message);
    const response = await fetch(`${WEBHOOK_URL}?message=${encodedMessage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data: WebhookResponse = await response.json();

    // Log the response for debugging purposes
    console.log("N8N Response:", data);

    // Extract text directly from content.parts[0].text
    // The previous code was looking for data.data.content... which was incorrect
    const text = data?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn("Unexpected response structure", data);
      return "I received a response, but couldn't process the text content. Please try again.";
    }

    return text;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};