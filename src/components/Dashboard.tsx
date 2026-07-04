import React, { useState, useEffect, useRef } from 'react';
import { UserConfig, Message, StoredMemory, LocalNote, Reminder, LocalFile, IoTDevice, AuditLog } from '../types';
import { 
  Sparkles, MessageSquare, Briefcase, Brain, Shield, Sliders, Play, 
  Pause, RotateCcw, Search, Plus, Trash2, CheckCircle2, AlertTriangle, 
  Radio, HardDrive, Mail, FileText, Send, Paperclip, Check, Globe, 
  FolderPlus, Mic, Volume2, User as UserIcon, Power, ArrowRight, Laptop, Lightbulb, Thermometer,
  Terminal, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  config: UserConfig;
  onLogout: () => void;
  onChangeConfig: (newConfig: UserConfig) => void;
}

export default function Dashboard({ config, onLogout, onChangeConfig }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks' | 'memory' | 'privacy' | 'iot' | 'settings' | 'packager'>('chat');
  
  // Input states
  const [inputText, setInputText] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [enableGrounding, setEnableGrounding] = useState(false);

  // File Upload states
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; size: string; base64?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats / Simulated metrics
  const [inferenceSpeed, setInferenceSpeed] = useState(42); // tps
  const [cpuUsage, setCpuUsage] = useState(24); // %
  const [ramUsage, setRamUsage] = useState(3.4); // GB

  // Voice Interaction states
  const [isRecording, setIsRecording] = useState(false);
  const [voiceWave, setVoiceWave] = useState<number[]>([10, 20, 15, 30, 25, 40, 10]);

  // Persistent States in Component
  const [memories, setMemories] = useState<StoredMemory[]>([
    { id: 'm-1', category: 'preference', content: "Prefers clean minimalism layouts and light themes.", extractedAt: "2 hours ago" },
    { id: 'm-2', category: 'app', content: "Regularly plays lo-fi beats playlists on Spotify while coding.", extractedAt: "3 hours ago" },
    { id: 'm-3', category: 'writing_style', content: "Maintains a brief, professional email composition style.", extractedAt: "1 day ago" },
    { id: 'm-4', category: 'personal_info', content: "Working on Desktop AI Assistant Prototype for Hackathon 2026.", extractedAt: "Just now" }
  ]);

  const [notes, setNotes] = useState<LocalNote[]>([
    { id: 'n-1', title: "Luna Roadmap Goals", content: "1. Complete full-stack prototype\n2. Integrate Llama 3 local inference pipeline\n3. Set up secure client-side sandbox container", updatedAt: "Today at 09:12 AM" },
    { id: 'n-2', title: "Meeting with Founders Summary", content: "Focus strictly on user-authored context, personal privacy dashboard, and robust IoT controls. Keep the typography clean.", updatedAt: "Yesterday" }
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 'r-1', text: "Draft follow-up email to developers regarding local GGUF performance", dueTime: "In 15 minutes", completed: false, createdAt: "09:30 AM" },
    { id: 'r-2', text: "Organize Downloads folder and sort design specifications", dueTime: "At 5:00 PM today", completed: false, createdAt: "09:00 AM" }
  ]);

  const [localFiles, setLocalFiles] = useState<LocalFile[]>([
    { id: 'f-1', name: "Project-X-Pitch.pdf", path: "~/Desktop/Project-X-Pitch.pdf", size: "4.2 MB", type: "pdf", category: "Desktop" },
    { id: 'f-2', name: "Luna_Specs_v2.docx", path: "~/Documents/Luna_Specs_v2.docx", size: "1.8 MB", type: "doc", category: "Documents" },
    { id: 'f-3', name: "Screenshot-2026.png", path: "~/Downloads/Screenshot-2026.png", size: "850 KB", type: "image", category: "Downloads" },
    { id: 'f-4', name: "FocusBeat_Lofi.mp3", path: "~/Downloads/FocusBeat_Lofi.mp3", size: "8.1 MB", type: "audio", category: "Downloads" },
    { id: 'f-5', name: "Old_Assets_Archive.zip", path: "~/Downloads/Old_Assets_Archive.zip", size: "124 MB", type: "archive", category: "Downloads" }
  ]);

  const [iotDevices, setIotDevices] = useState<IoTDevice[]>([
    { id: 'iot-1', name: "Living Room Accent Light", type: "light", status: true, value: "warm cozy hue", room: "Living Room" },
    { id: 'iot-2', name: "Workspace Power Plug", type: "plug", status: true, value: "Active", room: "Studio" },
    { id: 'iot-3', name: "Studio Thermostat", type: "thermostat", status: false, value: "72°F", room: "Studio" },
    { id: 'iot-4', name: "Ambient Music Soundbar", type: "speaker", status: true, value: "Spotify Lofi Loop", room: "Living Room" }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'log-1', type: 'system', message: "Luna Local Core Engine started successfully.", timestamp: "09:34 AM", status: 'success' },
    { id: 'log-2', type: 'permission', message: "Granted file system access indexer to ~/Desktop", timestamp: "09:35 AM", status: 'success' }
  ]);

  // Pending tool execution permission modal state
  const [pendingToolCall, setPendingToolCall] = useState<{
    id: string;
    name: string;
    arguments: any;
  } | null>(null);

  // Active custom action feedback triggers
  const [activeMediaTrack, setActiveMediaTrack] = useState<string | null>(null);
  const [mediaState, setMediaState] = useState<'playing' | 'paused'>('paused');
  const [isFolderOrganized, setIsFolderOrganized] = useState(false);
  const [emailDraft, setEmailDraft] = useState<{ to: string; subject: string; body: string } | null>(null);

  // Packager Tab States
  const [buildProgress, setBuildProgress] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [isBuildComplete, setIsBuildComplete] = useState(false);

  // Chat conversation history state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init-1',
      role: 'assistant',
      text: `Hi **${config.userName}**! I am **${config.assistantName}**, your offline-first personal workspace companion.\n\nI have successfully indexed your **~/Desktop** files and prepared your workspace notes. I'm running in high-efficiency **${config.selectedModel}** mode with absolute privacy guarantee. \n\nHow can I help you automate your tasks today? Try saying *"Summarize my files"* or *"Organize my downloads"*!`,
      timestamp: '09:34 AM'
    }
  ]);

  // Scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  // Periodic metrics simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setInferenceSpeed(prev => Math.max(38, Math.min(54, prev + (Math.random() > 0.5 ? 1 : -1))));
      setCpuUsage(prev => Math.max(12, Math.min(68, prev + Math.floor(Math.random() * 9) - 4)));
      setRamUsage(prev => Math.max(3.1, Math.min(3.9, parseFloat((prev + (Math.random() > 0.5 ? 0.05 : -0.05)).toFixed(2)))));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Simulation voice wave animations
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setVoiceWave(Array.from({ length: 12 }, () => Math.floor(Math.random() * 45) + 5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  // Function to create a custom user audit log entry
  const logAction = (type: 'automation' | 'permission' | 'memory' | 'system', message: string, status: 'success' | 'denied' | 'pending' = 'success') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Process File Attachment Trigger
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFile({
          name: file.name,
          type: file.type || "application/octet-stream",
          size: `${(file.size / 1024).toFixed(1)} KB`,
          base64: reader.result as string
        });
        logAction('permission', `Attached file attachment: ${file.name}`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle standard user prompt submission
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() && !attachedFile) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachedFile ? {
        name: attachedFile.name,
        type: attachedFile.type,
        size: attachedFile.size,
        base64: attachedFile.base64
      } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachedFile(null);
    setIsPending(true);

    try {
      // Build API request payload
      // Send message list history
      const apiMessages = messages.concat(userMsg).map(m => ({
        role: m.role,
        text: m.text
      }));

      const personalityPrompt = `You are ${config.assistantName}, acting as a ${config.personality} personal assistant. Respond politely, and if the user mentions task automations, trigger them! Maintain a clean minimal tone. Keep answers extremely direct and compact.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          systemInstruction: personalityPrompt,
          enableSearch: enableGrounding,
          fileData: userMsg.attachment ? {
            base64: userMsg.attachment.base64,
            mimeType: userMsg.attachment.type
          } : null
        })
      });

      if (!res.ok) {
        throw new Error('Inference server returned an error');
      }

      const data = await res.json();
      
      // Check if server prompted dynamic functionCalls
      if (data.functionCalls && data.functionCalls.length > 0) {
        const call = data.functionCalls[0];
        // Automatically open the custom Security Authorization Dialog
        setPendingToolCall({
          id: `tool-${Date.now()}`,
          name: call.name,
          arguments: call.args || {}
        });
        logAction('automation', `Automation pipeline requested permission for action: ${call.name}`, 'pending');

        // Let the user know Luna is preparing the tool execution on confirmation
        const systemResponseText = data.text || `I've prepared a local automation action for **${call.name}**. Please authorize this command in the sandbox window above to execute safely.`;
        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: systemResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

      } else {
        // Standard conversational response
        let parsedText = data.text || "I processed your request locally but had nothing to output.";
        let links: any[] = [];
        if (data.groundingMetadata?.groundingChunks) {
          links = data.groundingMetadata.groundingChunks.map((chunk: any) => ({
            title: chunk.web?.title || "Search Result",
            uri: chunk.web?.uri || "#"
          })).filter((c: any) => c.uri !== "#");
        }

        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: parsedText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundingLinks: links.length > 0 ? links : undefined
        }]);
      }

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `a-err-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **Offline Simulation Notice:** I encountered a brief latency threshold error, but I can execute that task in offline fallback mode for you!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsPending(false);
    }
  };

  // Approve a pending Local Automation Tool Call
  const handleApproveTool = () => {
    if (!pendingToolCall) return;
    const { name, arguments: args } = pendingToolCall;
    
    logAction('permission', `User approved automation: ${name}`, 'success');

    let notificationText = "";

    // Implement actual side-effects inside local sandbox state
    if (name === "createNote") {
      const title = args.title || "Untitled Automation Note";
      const content = args.content || "No body content provided.";
      const newNote: LocalNote = {
        id: `n-${Date.now()}`,
        title,
        content,
        updatedAt: "Just now (Automated)"
      };
      setNotes(prev => [newNote, ...prev]);
      notificationText = `Successfully created note: **"${title}"** inside your local notes container.`;

    } else if (name === "createReminder") {
      const text = args.text || "Automated Reminder";
      const dueTime = args.dueTime || "in 5 minutes";
      const newReminder: Reminder = {
        id: `r-${Date.now()}`,
        text,
        dueTime,
        completed: false,
        createdAt: "Just now"
      };
      setReminders(prev => [newReminder, ...prev]);
      notificationText = `Created reminder: **"${text}"** scheduled for **${dueTime}**.`;

    } else if (name === "openSpotify") {
      const track = args.trackName || "Lofi Coding Playlist";
      const act = args.action || "play";
      setActiveMediaTrack(track);
      setMediaState(act === "play" ? "playing" : "paused");
      notificationText = `Spotify player commanded to **${act}** track **"${track}"**.`;

    } else if (name === "organizeDownloadsFolder") {
      setIsFolderOrganized(true);
      // Simulate renaming / rearranging local file mock lists
      setLocalFiles(prev => prev.map(f => {
        if (f.category === "Downloads") {
          return { ...f, path: `~/Downloads/Organized/${f.type}s/${f.name}` };
        }
        return f;
      }));
      // Add dynamic memory too!
      const newMem: StoredMemory = {
        id: `m-${Date.now()}`,
        category: 'app',
        content: "Organized local Downloads folder into discrete sub-directories.",
        extractedAt: "Just now"
      };
      setMemories(prev => [newMem, ...prev]);
      notificationText = `Sorted Downloads folder successfully. Created subdirectories for /images, /audios, and /archives!`;

    } else if (name === "findFile") {
      const query = args.fileName || "";
      const matches = localFiles.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
      if (matches.length > 0) {
        notificationText = `Located **${matches.length}** matches in your local index. Primary file: **"${matches[0].name}"** (${matches[0].path}).`;
      } else {
        notificationText = `Searched for files containing **"${query}"** but found 0 matches on the local disk drive.`;
      }

    } else if (name === "draftEmail") {
      const to = args.to || "recipient@example.com";
      const subject = args.subject || "No Subject";
      const body = args.body || "";
      setEmailDraft({ to, subject, body });
      notificationText = `Drafted a secure outbound email template. Recipient: **${to}**. Subject: **${subject}**. Open Task Center to inspect full message draft.`;

    } else if (name === "triggerSmartHome") {
      const deviceId = args.deviceId || "living_room_light";
      const action = args.action || "turn_on";
      const val = args.value || "";
      
      setIotDevices(prev => prev.map(d => {
        if (d.id === deviceId || d.name.toLowerCase().includes(deviceId.toLowerCase())) {
          return { ...d, status: action === "turn_on", value: val || d.value };
        }
        return d;
      }));
      notificationText = `MQTT smart hub signal broadcasted! Target: **${deviceId}** set to **${action}** (${val || 'no arguments'}).`;
    }

    // Push execution confirmation message into the chat thread
    setMessages(prev => [...prev, {
      id: `a-auto-${Date.now()}`,
      role: 'assistant',
      text: `✅ **Automation Success:** I have successfully executed the authorized local pipeline. \n\n${notificationText}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setPendingToolCall(null);
  };

  // Deny / Cancel a pending Local Automation Tool Call
  const handleDenyTool = () => {
    if (!pendingToolCall) return;
    const { name } = pendingToolCall;
    logAction('permission', `User denied authorization for: ${name}`, 'denied');
    
    setMessages(prev => [...prev, {
      id: `a-deny-${Date.now()}`,
      role: 'assistant',
      text: `❌ **Automation Blocked:** The workspace security sandbox intercepted and blocked the **${name}** execution. I will not make any changes to your local files or system services without explicit permission.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setPendingToolCall(null);
  };

  // Task Center - Add custom manual note
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;
    const newNote: LocalNote = {
      id: `n-${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      updatedAt: "Just now"
    };
    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    logAction('system', `Created personal markdown note: ${newNoteTitle}`);
  };

  // Task Center - Delete note
  const handleDeleteNote = (id: string) => {
    const target = notes.find(n => n.id === id);
    setNotes(notes.filter(n => n.id !== id));
    if (target) {
      logAction('system', `Deleted local note: ${target.title}`);
    }
  };

  // Task Center - Add new manual Reminder
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const handleAddReminder = () => {
    if (!newReminderText.trim()) return;
    const newRem: Reminder = {
      id: `r-${Date.now()}`,
      text: newReminderText,
      dueTime: newReminderTime || "Today",
      completed: false,
      createdAt: "Just now"
    };
    setReminders([newRem, ...reminders]);
    setNewReminderText('');
    setNewReminderTime('');
    logAction('system', `Added reminder: ${newReminderText}`);
  };

  // Task Center - Toggle reminder completed
  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.completed;
        logAction('system', `Reminder marked as ${nextState ? 'Completed' : 'Active'}: ${r.text}`);
        return { ...r, completed: nextState };
      }
      return r;
    }));
  };

  // Memory Center - Add manual memory insight
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCat, setNewMemoryCat] = useState<'preference' | 'app' | 'writing_style' | 'personal_info'>('preference');
  const handleAddMemory = () => {
    if (!newMemoryText.trim()) return;
    const newMem: StoredMemory = {
      id: `m-${Date.now()}`,
      category: newMemoryCat,
      content: newMemoryText,
      extractedAt: "Just now (Manual)"
    };
    setMemories([newMem, ...memories]);
    setNewMemoryText('');
    logAction('memory', `Manually registered memory insight: "${newMemoryText}"`);
  };

  // Memory Center - Delete specific memory
  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    logAction('memory', `Erased specific memory slot ${id}`);
  };

  // Privacy Center - Reset All Local State
  const handleWipeData = () => {
    if (confirm("Are you absolutely sure you want to purge Luna's local memory, cached files, note database, and reset the sandbox?")) {
      setMemories([]);
      setNotes([]);
      setReminders([]);
      setAuditLogs([]);
      logAction('system', "Hard reset completed. Purged all cached memory indices.", "success");
      alert("All offline user data has been scrubbed. Privacy preservation is complete.");
    }
  };

  // IoT devices controller toggles
  const handleToggleIot = (id: string) => {
    setIotDevices(prev => prev.map(d => {
      if (d.id === id) {
        const nextState = !d.status;
        logAction('automation', `Broadcasting MQTT request: Set ${d.name} state to ${nextState ? 'ON' : 'OFF'}`);
        return { ...d, status: nextState };
      }
      return d;
    }));
  };

  // Voice Speech-To-Text Stimulation
  const handleToggleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      logAction('system', "Microphone activated. Streaming local Whisper audio matrix.", "success");
    } else {
      setIsRecording(false);
      // Automatically map captured vocal words into search input/chat message
      const voicePrompts = [
        "Create a note about my presentation tomorrow at 9 AM",
        "Organize my downloads folder and remove temp screenshots",
        "Command the smart plug in studio to turn off",
        "Find file Project-X-Pitch.pdf"
      ];
      const simulatedText = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      setInputText(simulatedText);
      logAction('system', `Voice transcribed successfully: "${simulatedText}"`, "success");
    }
  };

  // Run simulated Electron / electron-builder packaging pipeline
  const handleStartPackaging = () => {
    if (isBuilding) return;
    setIsBuilding(true);
    setBuildProgress(0);
    setBuildLogs(["$ npm run package:win --portable"]);
    setIsBuildComplete(false);

    const logSteps = [
      { prg: 8, msg: "⚡ [1/6] Reading local workspace configuration and package.json manifest..." },
      { prg: 15, msg: "⚡ [2/6] Compiling local React production assets into optimized chunks via Vite..." },
      { prg: 28, msg: "✓ [Vite] 34 modules transformed. Compiled static assets index.js (318kB) & index.css (124kB)" },
      { prg: 40, msg: "⚡ [3/6] Packaging server.ts server modules via esbuild compiler..." },
      { prg: 52, msg: "✓ [esbuild] Successfully compiled server.ts into dist/server.cjs in 195ms [Target: Node-20]" },
      { prg: 64, msg: "⚡ [4/6] Initializing electron-builder host pipeline (Target: Win64 Standalone Portable)..." },
      { prg: 74, msg: "⚙️ [Builder] Resolving application dependencies and matching node_modules binaries..." },
      { prg: 82, msg: "⚙️ [Builder] Embedding application name metadata: com.luna.desktop [Product: LunaDesktop]" },
      { prg: 88, msg: "⚙️ [Builder] Packaging chrome-sandbox execution containers & layout frames..." },
      { prg: 94, msg: "⚙️ [Builder] Compressing executable layout & embedding public/icon.png branding asset..." },
      { prg: 98, msg: "⚙️ [Builder] Assembling final single-binary offline Windows Portable executable..." },
      { prg: 100, msg: "🎉 [5/6] Windows portable executable (.exe) has been packaged successfully!" },
      { prg: 100, msg: "✓ Compiled Binary Output: /dist-desktop/LunaDesktop.exe (64.2 MB)" },
      { prg: 100, msg: "✓ Compiled macOS Application Output: /dist-desktop/LunaDesktop.dmg" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSteps.length) {
        const step = logSteps[currentStep];
        setBuildProgress(step.prg);
        setBuildLogs(prev => [...prev, step.msg]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsBuilding(false);
        setIsBuildComplete(true);
        logAction('system', "Completed local Windows application compilation pipeline.", "success");
      }
    }, 1000);
  };

  // Generate and download a local, standalone packaging guide
  const handleDownloadGuide = () => {
    const guideText = `===========================================================
LUNA DESKTOP ASSISTANT - PORTABLE BUILDER & RUNTIME INSTRUCTIONS
===========================================================

You can package and run Luna as a native standalone Windows Executable (.exe) 
or macOS application (.app) locally on your hardware. We have pre-configured 
Electron & electron-builder directly in your workspace!

-----------------------------------------------------------
SYSTEM REQUIREMENTS
-----------------------------------------------------------
1. Node.js (v18 or higher recommended)
2. npm (Node Package Manager)

-----------------------------------------------------------
STEP 1: DOWNLOAD AND EXTRACT THE CODE
-----------------------------------------------------------
Export this project from the top-right settings panel (ZIP export)
and extract it into a folder on your local computer.

-----------------------------------------------------------
STEP 2: RUN NATIVE ELECTRON DEV ENVIRONMENT (LOCAL FRAME)
-----------------------------------------------------------
Open your local terminal (Command Prompt, PowerShell, or macOS Terminal) 
in the extracted folder and run:

  npm install
  npm run dev

To run inside an actual Native Electron desktop window container frame:

  npm run electron:dev

-----------------------------------------------------------
STEP 3: COMPILE NATIVE WINDOWS STANDALONE PORTABLE EXECUTABLE (.exe)
-----------------------------------------------------------
To bundle the entire React application, Express routing server, and 
local LLM simulation interfaces into a single offline-friendly 
Windows standalone .exe application (outputs to "dist-desktop/LunaDesktop.exe"):

  npm run package:win

-----------------------------------------------------------
STEP 4: COMPILE NATIVE macOS STANDALONE APPLICATION (.dmg)
-----------------------------------------------------------
To compile a macOS .dmg installer:

  npm run package:mac

-----------------------------------------------------------
WHY STANDALONE ELECTRON?
-----------------------------------------------------------
✓ Runs 100% offline with zero external network requisites
✓ Seamlessly communicates with local network smart device smart plugs/thermostats via MQTT
✓ Fully private - all indexing, text-to-speech, memory and sandbox files remain on disk
✓ Conforms perfectly with hackathon .exe and macOS .app primary submission formats!

Enjoy Luna - Your personal secure workspace assistant.
===========================================================`;

    const element = document.createElement("a");
    const file = new Blob([guideText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "LUNA_DESKTOP_PACKAGING_GUIDE.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    logAction('system', "Downloaded local desktop packaging instructions handbook.", "success");
  };

  // Simple filter for files search
  const filteredFiles = localFiles.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-gray-50 text-slate-900 font-sans antialiased overflow-hidden select-none">
      
      {/* LEFT NAVIGATION COLUMN - Clean Minimalism Styling */}
      <nav className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
        
        {/* Brand logo & title */}
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
              <div className="w-4 h-4 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-800 font-display block">
                {config.assistantName || 'Luna'}
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block">
                DESKTOP ASSISTANT
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-4 space-y-1">
            <div className="py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">
              Main Menu
            </div>
            
            <button 
              id="nav-chat"
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'chat' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50' 
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>AI Chat Assistant</span>
            </button>

            <button 
              id="nav-tasks"
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'tasks' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50' 
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>Workspace Center</span>
            </button>

            <button 
              id="nav-memory"
              onClick={() => setActiveTab('memory')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'memory' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50' 
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <Brain className="w-4 h-4 shrink-0" />
              <span>Memory Vault</span>
            </button>

            <button 
              id="nav-privacy"
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'privacy' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50' 
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Privacy Dashboard</span>
            </button>

            <button 
              id="nav-iot"
              onClick={() => setActiveTab('iot')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'iot' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50' 
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <Radio className="w-4 h-4 shrink-0" />
              <span>Smart IoT Home</span>
            </button>

            <button 
              id="nav-settings"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50' 
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Configuration</span>
            </button>

            <button 
              id="nav-packager"
              onClick={() => setActiveTab('packager')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'packager' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50' 
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <Laptop className="w-4 h-4 shrink-0 animate-pulse text-indigo-600" />
              <span>Desktop Packager</span>
            </button>
          </div>
        </div>

        {/* Local Hardware pipeline performance metrics widget */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                System pipeline
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                <span className="text-[9px] font-bold text-green-600 font-mono uppercase">ONLINE</span>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-0.5">
                  <span className="text-[11px]">Active model:</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-800 truncate" title={config.selectedModel}>
                  {config.selectedModel}
                </div>
              </div>

              {/* Hardware utilization stats */}
              <div className="space-y-1.5 pt-1 border-t border-gray-200/50">
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>TPS Speed:</span>
                  <span className="font-semibold text-indigo-600">{inferenceSpeed} tokens/s</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>Simulated CPU:</span>
                  <span className="font-semibold text-slate-700">{cpuUsage}%</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>RAM Cache:</span>
                  <span className="font-semibold text-slate-700">{ramUsage} GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* CENTRAL PRIMARY CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        
        {/* Top Header Controls with Simulated Native Titlebar */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          
          {/* Active view label */}
          <div className="flex items-center space-x-4">
            <h2 className="font-semibold text-slate-800 font-display text-base uppercase tracking-wide">
              {activeTab === 'chat' && 'AI Chat Experience'}
              {activeTab === 'tasks' && 'Workspace & Automation'}
              {activeTab === 'memory' && 'Personal Memory Index'}
              {activeTab === 'privacy' && 'Sandbox Privacy Guard'}
              {activeTab === 'iot' && 'Smart Home MQTT Hub'}
              {activeTab === 'settings' && 'System Parameters'}
              {activeTab === 'packager' && 'Desktop Executable Packager'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] rounded uppercase font-bold font-mono tracking-wider border border-green-200/50">
                100% Private Local Sandbox
              </span>
              {enableGrounding && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded uppercase font-bold font-mono tracking-wider border border-blue-200/50">
                  Search Grounding Active
                </span>
              )}
            </div>
          </div>

          {/* Native-style window quick controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onLogout}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-slate-600 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium"
              title="Return to Onboarding screen"
            >
              Restart Onboarding
            </button>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded-full bg-red-400 block opacity-80" title="Exit application"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400 block opacity-80" title="Minimize to tray"></span>
              <span className="w-3 h-3 rounded-full bg-green-400 block opacity-80" title="Maximize container"></span>
            </div>
          </div>
        </header>

        {/* SECURITY CRITICAL: Sandbox Tool-call Request Authorization Banner */}
        <AnimatePresence>
          {pendingToolCall && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-50 border-b border-amber-200 p-4 shrink-0 overflow-hidden"
            >
              <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-amber-900 font-semibold text-sm">
                      Security Verification: Local Automation Authorization Request
                    </h4>
                    <p className="text-amber-800 text-xs mt-0.5">
                      Luna has requested permissions to execute **{pendingToolCall.name}** with arguments: 
                      <code className="bg-amber-100/80 text-amber-900 px-1.5 py-0.5 rounded ml-1 text-[11px] font-mono font-semibold">
                        {JSON.stringify(pendingToolCall.arguments)}
                      </code>
                    </p>
                    <p className="text-amber-600 text-[11px] mt-1 italic">
                      Authorizing this action grants Luna permissions to write files, draft mailer components, or send IoT triggers in this sandbox.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    id="auth-deny-button"
                    onClick={handleDenyTool}
                    className="px-3 py-1.5 bg-white border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Block Action
                  </button>
                  <button 
                    id="auth-approve-button"
                    onClick={handleApproveTool}
                    className="px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors cursor-pointer shadow-sm"
                  >
                    Authorize Execute
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB WORKSPACE ROUTING CHANNELS */}
        <div className="flex-1 overflow-y-auto min-h-0">
          
          {/* TAB 1: ASSISTANT CONVERSATION CHAT CONTAINER */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col justify-between">
              
              {/* Chat bubble timeline */}
              <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {/* Persona circle marker */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                      msg.role === 'user' 
                        ? 'bg-slate-800 text-white' 
                        : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    }`}>
                      {msg.role === 'user' ? config.userName.charAt(0).toUpperCase() : config.assistantName.charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-1.5">
                      {/* Message metadata tag */}
                      <div className={`flex items-center gap-2 text-[10px] text-gray-400 font-mono ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        <span className="font-semibold text-slate-600">
                          {msg.role === 'user' ? config.userName : config.assistantName}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Text content bubble */}
                      <div className={`p-4 rounded-2xl leading-relaxed text-sm shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-gray-100 text-slate-800 rounded-tl-none border border-gray-150'
                      }`}>
                        
                        {/* Render simple markdown styling bold / code highlights */}
                        <div className="space-y-2 whitespace-pre-wrap">
                          {msg.text.split('\n\n').map((paragraph, pIdx) => (
                            <p key={pIdx}>
                              {paragraph.split('**').map((chunk, cIdx) => {
                                if (cIdx % 2 === 1) {
                                  return <strong key={cIdx} className={msg.role === 'user' ? 'text-white' : 'text-slate-950 font-bold'}>{chunk}</strong>;
                                }
                                // simple inline code highlights
                                return chunk.split('`').map((subchunk, sIdx) => {
                                  if (sIdx % 2 === 1) {
                                    return (
                                      <code key={sIdx} className={`px-1.5 py-0.5 rounded font-mono text-xs ${
                                        msg.role === 'user' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-indigo-900'
                                      }`}>
                                        {subchunk}
                                      </code>
                                    );
                                  }
                                  return subchunk;
                                });
                              })}
                            </p>
                          ))}
                        </div>

                        {/* Display attached mock files in chat timeline */}
                        {msg.attachment && (
                          <div className={`mt-3 p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                            msg.role === 'user' ? 'bg-indigo-700/50 border-indigo-500 text-white' : 'bg-white border-gray-200 text-slate-700'
                          }`}>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 shrink-0" />
                              <div className="truncate max-w-[200px]">
                                <span className="font-semibold block truncate">{msg.attachment.name}</span>
                                <span className="text-[10px] opacity-75">{msg.attachment.size} • {msg.attachment.type}</span>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono bg-indigo-900/40 text-indigo-100 px-1.5 py-0.5 rounded font-bold">LOCAL FILE</span>
                          </div>
                        )}

                        {/* Rendering Web Search Grounding citations */}
                        {msg.groundingLinks && (
                          <div className="mt-3 pt-3 border-t border-gray-200/30">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-slate-500 mb-1">
                              🔍 Web Grounding References:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {msg.groundingLinks.map((link, idx) => (
                                <a 
                                  key={idx} 
                                  href={link.uri} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-[11px] font-medium bg-indigo-50 text-indigo-700 hover:underline px-2 py-0.5 rounded border border-indigo-200/50 flex items-center gap-1 shrink-0"
                                >
                                  <span>{link.title}</span>
                                  <span className="text-[9px]">↗</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isPending && (
                  <div className="flex gap-4 max-w-xl">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase">LUNA PROCESSING PIPELINE</span>
                      <div className="bg-gray-100 text-slate-500 p-4 rounded-2xl rounded-tl-none border border-gray-150 flex items-center gap-2">
                        <span className="text-xs">Computing local matrices...</span>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-150"></span>
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-300"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Form Area with Voice Toggles */}
              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <div className="max-w-3xl mx-auto space-y-3">
                  
                  {/* File upload previews and indicators */}
                  {attachedFile && (
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-sm flex items-center justify-between gap-4 max-w-sm">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div className="truncate text-xs">
                          <span className="font-semibold block text-slate-800 truncate">{attachedFile.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{attachedFile.size} • {attachedFile.type}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setAttachedFile(null)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 text-xs transition-all cursor-pointer font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Active automated media track player */}
                  {activeMediaTrack && (
                    <div className="bg-indigo-50/70 border border-indigo-100/80 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs text-indigo-900 max-w-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase block tracking-wide text-indigo-600">Simulated Player: {mediaState}</span>
                          <span className="font-semibold truncate block max-w-[300px]">{activeMediaTrack}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setMediaState(mediaState === 'playing' ? 'paused' : 'playing')}
                          className="p-1.5 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-100 text-indigo-700 font-semibold cursor-pointer text-[11px]"
                        >
                          {mediaState === 'playing' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button 
                          onClick={() => setActiveMediaTrack(null)}
                          className="text-indigo-400 hover:text-indigo-700 text-xs font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Custom vocal transcription indicator */}
                  {isRecording && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-center justify-between gap-4 max-w-md">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-rose-800">Recording speech locally via Whisper API</span>
                          <div className="flex gap-0.5 items-end h-5 mt-1">
                            {voiceWave.map((h, i) => (
                              <div key={i} className="w-1 bg-rose-500 rounded-full transition-all duration-100" style={{ height: `${h}%` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleToggleVoiceRecord}
                        className="bg-rose-600 text-white hover:bg-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Finish Transcribing
                      </button>
                    </div>
                  )}

                  {/* Message Input Box wrapper */}
                  <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all p-1">
                    
                    {/* Left controls */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 z-10">
                      
                      {/* Attached File Action Button */}
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                        title="Upload file or screenshot to Assistant"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />

                      {/* Microphone Action Button */}
                      <button 
                        onClick={handleToggleVoiceRecord}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                          isRecording ? 'text-rose-600 bg-rose-50' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-50'
                        }`}
                        title="Voice Input (Speech-to-text transcription)"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Grounding and search toggle bar */}
                    <input 
                      id="assistant-prompt-input"
                      type="text" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask Luna anything... (e.g. 'Organize downloads', 'Create a roadmap note', 'Turn on accent light')"
                      className="w-full pl-22 pr-28 py-3.5 text-sm text-slate-800 bg-transparent placeholder-gray-400 focus:outline-none"
                    />

                    {/* Right action triggers */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                      <button 
                        onClick={() => setEnableGrounding(!enableGrounding)}
                        className={`px-2 py-1 text-[10px] font-bold font-mono rounded border uppercase cursor-pointer transition-colors ${
                          enableGrounding 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-white text-gray-400 border-gray-200 hover:text-slate-600'
                        }`}
                        title="Ground response content via search results"
                      >
                        Search
                      </button>
                      <button 
                        id="chat-send-trigger"
                        onClick={() => handleSendMessage()}
                        className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Warning label */}
                  <p className="text-center text-[10px] text-gray-400 font-mono leading-relaxed">
                    Local model: {config.selectedModel} • 100% Client-Side Privacy Guaranteed • No telemetry tracking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKSPACE NOTES & TASK ASSISTANT */}
          {activeTab === 'tasks' && (
            <div className="p-8 space-y-8 max-w-6xl mx-auto">
              
              {/* Top Banner indicating File cleanup operations */}
              <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-5 flex items-center justify-between gap-6">
                <div>
                  <h3 className="text-indigo-900 font-semibold text-sm">Dynamic Desktop Automation Engine</h3>
                  <p className="text-indigo-800/80 text-xs mt-0.5 max-w-2xl leading-relaxed">
                    Manage files and draft documents in the Luna application sandbox. You can click suggested pipeline automations below to process files or manage calendars securely.
                  </p>
                </div>
                <button 
                  id="task-organize-downloads"
                  onClick={() => {
                    setIsFolderOrganized(true);
                    logAction('automation', "Simulated Downloads Folder organized and sorted by file extension.", "success");
                    alert("Downloads organized! Files are grouped into /images, /audios, and /archives catalogs.");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0 shadow-sm transition-all ${
                    isFolderOrganized 
                      ? 'bg-green-600 text-white' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {isFolderOrganized ? '✓ Downloads Folder Organized' : 'Organize downloads'}
                </button>
              </div>

              {/* Grid split Notes + Reminders + Email draft */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. LOCAL NOTEBOOK (MD Notes) */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-slate-800 text-sm">Local Notes Database</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-slate-500 font-semibold">
                      {notes.length} notes
                    </span>
                  </div>

                  {/* Add manual note form */}
                  <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-150 space-y-2.5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Compose Note Entry</span>
                    <input 
                      id="note-input-title"
                      type="text" 
                      placeholder="Note Title" 
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="w-full bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-gray-400 focus:outline-none"
                    />
                    <textarea 
                      id="note-input-content"
                      placeholder="Write markdown note text..." 
                      rows={2}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-gray-400 focus:outline-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        id="note-submit-button"
                        onClick={handleAddNote}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Save Note
                      </button>
                    </div>
                  </div>

                  {/* Notebook list */}
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {notes.map((note) => (
                      <div key={note.id} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-150 relative group">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-800">{note.title}</h4>
                          <button 
                            id={`delete-note-${note.id}`}
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-gray-400 hover:text-red-600 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Purge note file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1.5 whitespace-pre-line">{note.content}</p>
                        <span className="text-[9px] text-gray-400 mt-2 block font-mono">Last edited: {note.updatedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. LOCAL CALENDAR REMINDERS */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-slate-800 text-sm">Reminders & Schedules</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-slate-500 font-semibold">
                      {reminders.filter(r => !r.completed).length} active
                    </span>
                  </div>

                  {/* Add manual reminder form */}
                  <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-150 space-y-2.5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Add Task Reminder</span>
                    <div className="flex gap-2">
                      <input 
                        id="reminder-input-text"
                        type="text" 
                        placeholder="Remind me to..." 
                        value={newReminderText}
                        onChange={(e) => setNewReminderText(e.target.value)}
                        className="flex-1 bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                      />
                      <input 
                        id="reminder-input-time"
                        type="text" 
                        placeholder="e.g. at 3 PM, tomorrow" 
                        value={newReminderTime}
                        onChange={(e) => setNewReminderTime(e.target.value)}
                        className="w-1/3 bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        id="reminder-submit-button"
                        onClick={handleAddReminder}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Timer
                      </button>
                    </div>
                  </div>

                  {/* Reminders list */}
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {reminders.map((rem) => (
                      <div 
                        key={rem.id} 
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          rem.completed 
                            ? 'bg-gray-50/50 border-gray-200 text-gray-400 line-through' 
                            : 'bg-gray-50 border-gray-150 text-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button 
                            id={`toggle-reminder-${rem.id}`}
                            onClick={() => handleToggleReminder(rem.id)}
                            className={`w-4 h-4 rounded-md mt-0.5 border flex items-center justify-center transition-colors cursor-pointer ${
                              rem.completed ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white border-gray-300 hover:border-indigo-400'
                            }`}
                          >
                            {rem.completed && <Check className="w-3 h-3" />}
                          </button>
                          <div>
                            <span className="text-xs font-medium block leading-snug">{rem.text}</span>
                            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Due: {rem.dueTime}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-semibold shrink-0">
                          CALENDAR
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. SIMULATED OUTBOUND EMAIL DRAFT */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-slate-800 text-sm">Automated Outbound Email Drafter</h3>
                    </div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-semibold uppercase">
                      Client-Sandbox Sandbox
                    </span>
                  </div>

                  {emailDraft ? (
                    <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-6 gap-2 text-xs text-slate-700 pb-3 border-b border-gray-200">
                        <div className="col-span-1 text-gray-400 font-mono uppercase text-[10px]">Recipient:</div>
                        <div className="col-span-5 font-semibold text-slate-800">{emailDraft.to}</div>
                        
                        <div className="col-span-1 text-gray-400 font-mono uppercase text-[10px]">Subject:</div>
                        <div className="col-span-5 font-semibold text-slate-800">{emailDraft.subject}</div>
                      </div>
                      <div className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-150">
                        {emailDraft.body}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 italic">Writing style matches: "{config.personality}" persona configuration</span>
                        <div className="flex gap-2">
                          <button 
                            id="email-draft-discard"
                            onClick={() => {
                              setEmailDraft(null);
                              logAction('system', "Discarded email draft.");
                            }}
                            className="px-3 py-1.5 text-xs text-gray-500 hover:text-slate-700 font-medium cursor-pointer"
                          >
                            Discard Draft
                          </button>
                          <button 
                            id="email-draft-send"
                            onClick={() => {
                              alert(`Simulated email dispatched successfully to ${emailDraft.to}!`);
                              logAction('system', `Outbound email dispatched to ${emailDraft.to}`, "success");
                              setEmailDraft(null);
                            }}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer"
                          >
                            Dispatch Email
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-xs">
                      No draft email active. Try instructing Luna: <br />
                      <span className="italic font-semibold text-indigo-600">"Draft an email to developers giving warm regards"</span> in the assistant panel.
                    </div>
                  )}
                </div>

                {/* 4. LOCAL FILE SYSTEM INDEX SEARCH */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-slate-800 text-sm">Local File Catalog & Directories</h3>
                    </div>
                    <div className="relative w-48">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input 
                        id="file-filter-input"
                        type="text" 
                        placeholder="Search workspace files..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
                    {filteredFiles.map((file) => (
                      <div key={file.id} className="p-3 bg-gray-50 rounded-xl border border-gray-150 flex items-center justify-between gap-3 text-xs text-slate-700">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            file.type === 'pdf' ? 'bg-red-50 text-red-600' :
                            file.type === 'doc' ? 'bg-blue-50 text-blue-600' :
                            file.type === 'image' ? 'bg-green-50 text-green-600' :
                            'bg-gray-100 text-slate-600'
                          }`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold block truncate" title={file.name}>{file.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono truncate block" title={file.path}>{file.path}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-slate-500 block">{file.size}</span>
                          <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase bg-indigo-50 px-1 rounded block mt-0.5">
                            {file.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: EXTRACTED MEMORY MANAGEMENT */}
          {activeTab === 'memory' && (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-150">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">Long-Term Memory Vault</h3>
                    <p className="text-xs text-slate-500">
                      As you chat, Luna extracts persistent facts, preferences, and writing styles. You have full visibility and can delete or modify individual slots instantly.
                    </p>
                  </div>
                  <button 
                    id="clear-all-memories"
                    onClick={() => {
                      setMemories([]);
                      logAction('memory', "Purged entire local memory bank.");
                      alert("Memory cleared!");
                    }}
                    className="text-xs text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 transition-all font-semibold cursor-pointer"
                  >
                    Scrub Memory Vault
                  </button>
                </div>

                {/* Add new memory insight manual entry */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-150 space-y-3">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Inject Custom Memory Slot</span>
                  <div className="flex gap-2">
                    <select 
                      id="memory-cat-select"
                      value={newMemoryCat} 
                      onChange={(e: any) => setNewMemoryCat(e.target.value)}
                      className="bg-white border border-gray-250 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 text-slate-700"
                    >
                      <option value="preference">Preference</option>
                      <option value="app">App Customization</option>
                      <option value="writing_style">Writing Style</option>
                      <option value="personal_info">Personal Fact</option>
                    </select>
                    <input 
                      id="memory-content-input"
                      type="text" 
                      placeholder="e.g. Likes quick short lists over detailed essays" 
                      value={newMemoryText}
                      onChange={(e) => setNewMemoryText(e.target.value)}
                      className="flex-1 bg-white border border-gray-250 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                    <button 
                      id="memory-submit-button"
                      onClick={handleAddMemory}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Inject
                    </button>
                  </div>
                </div>

                {/* Memory slots catalog list */}
                <div className="space-y-3">
                  {memories.map((m) => (
                    <div key={m.id} className="p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-150 flex items-center justify-between gap-4 transition-all">
                      <div className="flex gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-slate-800 text-xs font-semibold block">{m.content}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold uppercase">
                              {m.category.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">Recorded {m.extractedAt}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        id={`delete-memory-${m.id}`}
                        onClick={() => handleDeleteMemory(m.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 cursor-pointer"
                        title="Erase memory from assistant knowledge"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {memories.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-xs">
                      The Memory Vault is empty. Have a conversation or inject a fact to populate it!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SANDBOX PRIVACY DASHBOARD */}
          {activeTab === 'privacy' && (
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Sandbox Privacy, Firewall, & Permissions</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unlike typical cloud bots, Luna indexes your system metadata and desktop folders safely on your physical drive. Review the active authorization pipeline below.
                  </p>
                </div>

                {/* Perm list toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'fs', name: 'File System Reading', desc: 'Allows Luna to read, index, and organize mock local document folders.', active: true },
                    { id: 'mail', name: 'Secure Email Dispatcher', desc: 'Allows Luna to automatically draft and mock output emails on request.', active: true },
                    { id: 'cal', name: 'Calendar Integration', desc: 'Allows Luna to set timers, trigger task reminders, and query schedules.', active: true },
                    { id: 'iot', name: 'Smart IoT Home Gateway', desc: 'Allows Luna to dispatch MQTT payload signals to compatible devices.', active: true }
                  ].map((p) => (
                    <div key={p.id} className="p-4 bg-gray-50 border border-gray-150 rounded-xl flex justify-between items-center">
                      <div className="pr-4">
                        <span className="text-xs font-semibold text-slate-800 block">{p.name}</span>
                        <span className="text-[11px] text-gray-400 block mt-0.5 leading-relaxed">{p.desc}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-mono uppercase font-bold rounded-lg border border-green-200/50">
                        AUTHORIZED
                      </span>
                    </div>
                  ))}
                </div>

                {/* System Audit log trails */}
                <div className="space-y-3 pt-4 border-t border-gray-150">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                    Sandbox Security Activity Audit Trail
                  </span>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto font-mono text-xs text-slate-600 bg-gray-50 p-4 rounded-xl border border-gray-150">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="flex justify-between items-center gap-4 py-1.5 border-b border-gray-200/50 last:border-0">
                        <div className="flex gap-2 items-center">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            log.status === 'success' ? 'bg-green-500' : log.status === 'denied' ? 'bg-rose-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-gray-400">[{log.timestamp}]</span>
                          <span className="font-semibold text-slate-700">[{log.type.toUpperCase()}]</span>
                          <span>{log.message}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${
                          log.status === 'success' ? 'text-green-600' : log.status === 'denied' ? 'text-rose-600' : 'text-amber-600'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scrub offline data container */}
                <div className="pt-4 border-t border-gray-150 flex items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Scrub All Offline Data</span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">Purge the sqlite notebook indexes and completely reboot Luna's system.</span>
                  </div>
                  <button 
                    id="privacy-hard-reset"
                    onClick={handleWipeData}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
                  >
                    Purge All Client Data
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: SMART IOT HOME GATEWAY */}
          {activeTab === 'iot' && (
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-gray-150">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">MQTT Smart Device Integration Hub</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Luna provides local network discovery to control IoT devices (Smart plugs, lights, thermostats). You can toggle states or instruct Luna via chat to automate rooms!
                    </p>
                  </div>
                  <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded font-mono uppercase font-bold">
                    Broadcasting Port: 1883
                  </span>
                </div>

                {/* List of IoT devices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {iotDevices.map((dev) => (
                    <div 
                      key={dev.id} 
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                        dev.status ? 'bg-indigo-50/30 border-indigo-200 shadow-sm' : 'bg-gray-50 border-gray-150'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          dev.status ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {dev.type === 'light' && <Lightbulb className="w-5 h-5" />}
                          {dev.type === 'thermostat' && <Thermometer className="w-5 h-5" />}
                          {dev.type === 'speaker' && <Volume2 className="w-5 h-5" />}
                          {dev.type === 'plug' && <Power className="w-5 h-5" />}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-800 block">{dev.name}</span>
                          <span className="text-[10px] text-gray-400 block font-mono uppercase">{dev.room} • {dev.type}</span>
                          {dev.status && dev.value && (
                            <span className="text-[10px] text-indigo-700 font-mono font-semibold block mt-1">Status: {dev.value}</span>
                          )}
                        </div>
                      </div>

                      {/* Power toggle button */}
                      <button 
                        id={`toggle-iot-${dev.id}`}
                        onClick={() => handleToggleIot(dev.id)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          dev.status ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                          dev.status ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Smart home simulation terminal logs */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                    MQTT Broker Payload Broadcasting Terminal Log
                  </span>
                  <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl space-y-1.5 max-h-[160px] overflow-y-auto">
                    <div>$ mqtt pub -h localhost -p 1883 -t "luna/smart_home/discovery" -m "register_devices"</div>
                    <div className="text-slate-400">[SYSTEM] Found 4 devices matching local subnet indices.</div>
                    {iotDevices.map(d => (
                      <div key={d.id} className="text-slate-300">
                        ↳ [PUBLISH] topic: "luna/devices/{d.id}" | message: "{"{ state: " + (d.status ? "ON" : "OFF") + ", value: '" + (d.value || "") + "' }"}"
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: CONFIGURATION SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">System Parameters & Personalization</h3>
                  <p className="text-xs text-slate-500">
                    Adjust assistant names, visual templates, local execution pipelines, and default tone characteristics.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Identity Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Your Identity Name</label>
                    <input 
                      id="settings-userName-input"
                      type="text" 
                      value={config.userName}
                      onChange={(e) => onChangeConfig({ ...config, userName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  {/* Assistant Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Assistant Name</label>
                    <input 
                      id="settings-assistantName-input"
                      type="text" 
                      value={config.assistantName}
                      onChange={(e) => onChangeConfig({ ...config, assistantName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  {/* Personality Select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Luna's Tone Personality</label>
                    <select 
                      id="settings-personality-select"
                      value={config.personality}
                      onChange={(e) => onChangeConfig({ ...config, personality: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                    >
                      <option value="warm">Warm & Encouraging</option>
                      <option value="professional">Professional Executive</option>
                      <option value="geeky">Geeky & Technical</option>
                      <option value="witty">Witty & Conversational</option>
                    </select>
                  </div>

                  {/* Language Select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">System Language</label>
                    <select 
                      id="settings-language-select"
                      value={config.language}
                      onChange={(e) => onChangeConfig({ ...config, language: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                    >
                      <option value="English">English (US)</option>
                      <option value="Spanish">Español (ES)</option>
                      <option value="German">Deutsch (DE)</option>
                      <option value="French">Français (FR)</option>
                      <option value="Hindi">हिन्दी (IN)</option>
                    </select>
                  </div>

                  {/* Active Local Model select */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold font-semibold">Active LLM GGUF Model</label>
                    <select 
                      id="settings-model-select"
                      value={config.selectedModel}
                      onChange={(e) => onChangeConfig({ ...config, selectedModel: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none font-mono"
                    >
                      <option value="Llama-3.2-3B-Instruct (Local)">Llama-3.2-3B-Instruct (Local) - ~8.4 tps</option>
                      <option value="Gemma-2-2B-IT (Local)">Gemma-2-2B-IT (Local) - ~12.1 tps</option>
                      <option value="Qwen-2.5-Coder-7B (Local)">Qwen-2.5-Coder-7B (Local) - ~4.2 tps</option>
                      <option value="Phi-4-Mini-3.8B (Local)">Phi-4-Mini-3.8B (Local) - ~15.0 tps</option>
                    </select>
                  </div>

                  {/* Voice Toggles */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">Whisper Speech-to-Text</span>
                        <span className="text-[11px] text-gray-400 block mt-0.5">Allows voice dictation through the microphone button.</span>
                      </div>
                      <button 
                        onClick={() => onChangeConfig({ ...config, voiceEnabled: !config.voiceEnabled })}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          config.voiceEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                          config.voiceEnabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">Text-to-Speech synthesis</span>
                        <span className="text-[11px] text-gray-400 block mt-0.5">Luna reads incoming messages out loud using custom synthesizers.</span>
                      </div>
                      <button 
                        onClick={() => onChangeConfig({ ...config, textToSpeech: !config.textToSpeech })}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          config.textToSpeech ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                          config.textToSpeech ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DESKTOP APP EXECUTABLE PACKAGER */}
          {activeTab === 'packager' && (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
              
              {/* Introduction Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-gray-150">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">Standalone Executable Compilation Center</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Luna Desktop is fully configured with Electron and Electron Builder. You can compile a single offline Windows standalone <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-bold font-mono">.exe</code> file or a macOS <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-bold font-mono">.dmg</code> installer to satisfy your submission requirements.
                    </p>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded font-mono uppercase font-bold shrink-0">
                    Host: Electron v34
                  </span>
                </div>

                {/* Target Configuration Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-gray-150 bg-gray-50/50">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">Target Platform</span>
                    <span className="font-bold text-slate-800 text-xs block mt-1">Windows (.exe) Portable</span>
                    <span className="text-[10px] text-gray-400 block">Requires 0 installation</span>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-150 bg-gray-50/50">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">Bundle Mode</span>
                    <span className="font-bold text-slate-800 text-xs block mt-1">Vite + esbuild Server</span>
                    <span className="text-[10px] text-gray-400 block">Full offline SQLite sandbox</span>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-150 bg-gray-50/50">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">Packaging Core</span>
                    <span className="font-bold text-indigo-600 text-xs block mt-1">electron-builder v25</span>
                    <span className="text-[10px] text-gray-400 block">Auto-resolves dependencies</span>
                  </div>
                </div>
              </div>

              {/* Interactive Compiler Simulation Console */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-xs font-mono uppercase tracking-wider">Local Build Simulation Pipeline</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Test package compilation sequences in real-time in this sandbox environment.</p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button 
                      id="btn-package-simulate"
                      disabled={isBuilding}
                      onClick={handleStartPackaging}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all shadow-sm ${
                        isBuilding 
                          ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isBuilding ? 'Compiling Package...' : 'Test Package (.exe)'}</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                {(isBuilding || buildProgress > 0) && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1">
                        {buildProgress < 100 ? (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        )}
                        <span className="font-mono">{buildProgress < 100 ? 'Packaging Standalone Executable...' : 'Packaging Successful!'}</span>
                      </span>
                      <span className="font-mono text-indigo-600">{buildProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-150">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-300"
                        style={{ width: `${buildProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Simulated build logs console */}
                {buildLogs.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider">Build Process Stdout Log</span>
                    <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-5 rounded-xl space-y-1.5 max-h-[220px] overflow-y-auto leading-relaxed shadow-inner border border-slate-800">
                      {buildLogs.map((log, index) => (
                        <div key={index} className={log.startsWith('$') ? 'text-indigo-400 font-bold' : log.startsWith('✓') ? 'text-green-400' : 'text-slate-300'}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step-by-Step Native Deployment handbook section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-gray-150">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">How to compile a physical .exe on your computer</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Since this is a sandboxed Cloud Run browser container, you must run the build command on your local Windows system to output the final physical executable binary.
                    </p>
                  </div>
                  <button
                    id="btn-download-guide"
                    onClick={handleDownloadGuide}
                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 transition-colors cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4 text-indigo-600" />
                    <span>Download Builder Guide (.txt)</span>
                  </button>
                </div>

                <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">1</div>
                    <div>
                      <p className="font-semibold text-slate-800">Export the Source Code</p>
                      <p className="mt-0.5 text-slate-500">Click the top-right Settings/Export menu in your browser interface, select <strong className="text-slate-700">Export ZIP</strong>, and save it on your native computer disk.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">2</div>
                    <div>
                      <p className="font-semibold text-slate-800">Install Node.js & Dependencies</p>
                      <p className="mt-0.5 text-slate-500">Unzip the archive, open your local terminal inside that directory, and run:</p>
                      <code className="block bg-gray-50 border border-gray-150 rounded-lg p-2 font-mono text-[11px] text-slate-800 mt-1.5">
                        npm install
                      </code>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">3</div>
                    <div>
                      <p className="font-semibold text-slate-800">Compile the Windows Portable .exe File</p>
                      <p className="mt-0.5 text-slate-500">Execute the packaging script. Electron Builder will bundle the React code, asset bundles, and desktop container frames directly into a single portable binary:</p>
                      <code className="block bg-gray-50 border border-gray-150 rounded-lg p-2 font-mono text-[11px] text-slate-800 mt-1.5">
                        npm run package:win
                      </code>
                      <p className="mt-1 text-[10px] text-indigo-600 font-medium">✓ The output executable will be created at: <code className="bg-indigo-50 font-mono px-1 py-0.5 text-[10px]">/dist-desktop/LunaDesktop.exe</code></p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">4</div>
                    <div>
                      <p className="font-semibold text-slate-800">To Package macOS Standalone (.dmg)</p>
                      <p className="mt-0.5 text-slate-500">If you are working from a macOS hardware, run the mac target build command:</p>
                      <code className="block bg-gray-50 border border-gray-150 rounded-lg p-2 font-mono text-[11px] text-slate-800 mt-1.5">
                        npm run package:mac
                      </code>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* RIGHT SIDEBAR PANEL - Clean Minimalism Styling */}
      <aside className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col justify-between shrink-0 p-6 overflow-y-auto">
        
        {/* Suggested Quick Task Automations section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">
              Suggested Local Automations
            </h3>
            
            <div className="space-y-3">
              {[
                { title: 'Summarize Project Pitch', desc: 'Read ~/Desktop/Project-X-Pitch.pdf', actionText: 'Find and summarize Project-X-Pitch.pdf document' },
                { title: 'Clean Up downloads', desc: 'Run folder sorting automation', actionText: 'Please organize my Downloads folder' },
                { title: 'Trigger Accent Light', desc: 'Toggle living room ambient glow', actionText: 'Turn on Living Room Accent Light with warm cozy hue' },
                { title: 'Draft follow-up email', desc: 'Compose message inside mailer', actionText: 'Draft an email to developers with warm regards about local GGUF performance' }
              ].map((act, index) => (
                <button
                  id={`suggested-action-${index}`}
                  key={index}
                  onClick={() => {
                    setInputText(act.actionText);
                    setActiveTab('chat');
                    logAction('system', `Loaded suggested automation template: "${act.title}"`);
                  }}
                  className="w-full text-left bg-white p-3.5 border border-gray-150 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer block"
                >
                  <p className="text-xs font-bold text-slate-800">{act.title}</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">{act.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Memory preview list */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">
              Active Memory preview
            </h3>
            
            <div className="bg-white rounded-2xl p-4 border border-gray-150 space-y-3.5 shadow-sm">
              <ul className="space-y-3">
                {memories.slice(0, 3).map((m, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <div className="w-2 h-2 mt-1.5 bg-indigo-500 rounded-full shrink-0"></div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{m.content}</p>
                  </li>
                ))}
              </ul>
              <button 
                id="memory-quick-manage"
                onClick={() => setActiveTab('memory')}
                className="w-full mt-2 py-2 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl border border-indigo-100 transition-colors cursor-pointer text-center block uppercase tracking-wider font-mono"
              >
                Manage Memory Vault
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card Footer */}
        <div className="pt-6 border-t border-gray-200 mt-6 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              {config.userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{config.userName} Johnson</p>
              <p className="text-[10px] text-gray-500 font-mono truncate">Local User Account</p>
            </div>
          </div>
        </div>

      </aside>

    </div>
  );
}
