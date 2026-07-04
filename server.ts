import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: '12mb' })); // support file and image payloads

const PORT = 3000;

// Initialize Gemini SDK with telemetry user-agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Expose API routes first
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, enableSearch, fileData } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    // Convert client messages to Gemini content structures
    const contents: any[] = [];
    
    // Process fileData if present
    let uploadedPart: any = null;
    if (fileData && fileData.base64) {
      // Expect base64 as full data-uri or bare base64
      let rawBase64 = fileData.base64;
      if (rawBase64.includes(",")) {
        rawBase64 = rawBase64.split(",")[1];
      }
      uploadedPart = {
        inlineData: {
          data: rawBase64,
          mimeType: fileData.mimeType || "image/png"
        }
      };
    }

    // Build contents history
    messages.forEach((msg: any, index: number) => {
      const parts: any[] = [];
      
      if (msg.text) {
        parts.push({ text: msg.text });
      }
      
      // If this is the final message from user, attach file attachment as a part
      if (index === messages.length - 1 && uploadedPart && msg.role !== 'assistant') {
        parts.push(uploadedPart);
      }
      
      if (parts.length > 0) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: parts
        });
      }
    });

    // Define function declarations for local desktop task automation and smart home
    const desktopTools = [
      {
        name: "createNote",
        description: "Creates a personal markdown note inside Luna's local notebook.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the note." },
            content: { type: Type.STRING, description: "The content body of the note." }
          },
          required: ["title", "content"]
        }
      },
      {
        name: "createReminder",
        description: "Creates a reminder schedule with a timer alert.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "What the user needs to be reminded about (e.g. 'Submit budget spreadsheet')." },
            dueTime: { type: Type.STRING, description: "Timing prompt (e.g., 'in 10 seconds', 'tomorrow at 3 PM')." }
          },
          required: ["text", "dueTime"]
        }
      },
      {
        name: "openSpotify",
        description: "Commands the simulated media music player or launches Spotify.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            trackName: { type: Type.STRING, description: "Name of the track, artist, or playlist." },
            action: { type: Type.STRING, description: "Player state: 'play', 'pause', 'next', 'prev'." }
          },
          required: ["action"]
        }
      },
      {
        name: "organizeDownloadsFolder",
        description: "Simulates sorting, renaming, and cleaning up chaotic folders such as the Downloads folder.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: "findFile",
        description: "Locates custom user files, documents, or photos inside local directories.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            fileName: { type: Type.STRING, description: "Name filter key of the file to lookup." }
          },
          required: ["fileName"]
        }
      },
      {
        name: "draftEmail",
        description: "Drafts a simulated outlook/gmail message with mailer layout details.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            to: { type: Type.STRING, description: "The recipient address." },
            subject: { type: Type.STRING, description: "Subject of the email." },
            body: { type: Type.STRING, description: "Drafted message content." }
          },
          required: ["to", "subject", "body"]
        }
      },
      {
        name: "triggerSmartHome",
        description: "Sends automated MQTT commands to control home IoT integrations (e.g., lights, thermostats).",
        parameters: {
          type: Type.OBJECT,
          properties: {
            deviceId: { type: Type.STRING, description: "Device identity (e.g. 'living_room_light', 'bedroom_speaker', 'thermostat')." },
            action: { type: Type.STRING, description: "The action, such as 'turn_on', 'turn_off', or 'set_value'." },
            value: { type: Type.STRING, description: "Optional state value (e.g., 'warm cozy hue', '72 degrees', 'bright blue')." }
          },
          required: ["deviceId", "action"]
        }
      }
    ];

    const configTools: any[] = [{ functionDeclarations: desktopTools }];
    if (enableSearch) {
      configTools.push({ googleSearch: {} });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction || "You are Luna, a highly sophisticated local-first AI assistant living on the user's desktop computer. You have access to local tools for note creation, file search, email drafting, music playback control, folder cleanup, and smart home control. If the user asks for a task that maps to these tools, ALWAYS call the corresponding function rather than just talking about it. Speak casually but politely, and be highly responsive.",
        tools: configTools,
        toolConfig: enableSearch ? { includeServerSideToolInvocations: true } : undefined
      }
    });

    res.json({
      text: response.text || "",
      functionCalls: response.functionCalls || null,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
    });

  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "An error occurred during generative processing" });
  }
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
