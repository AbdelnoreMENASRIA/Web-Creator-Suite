import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileText, Link as LinkIcon, Plus, Check, X, Loader2, Clock } from "lucide-react";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  attachments?: { type: "pdf" | "link"; name: string; url: string }[];
  createdAt: string;
  isRead: boolean;
}

export interface MessagingProps {
  sessionId: string;
  sessionTitle: string;
  recipientId: string;
  recipientName: string;
  isFormateur: boolean;
  messages: Message[];
  onSendMessage: (content: string, attachments: { type: "pdf" | "link"; name: string; url: string }[]) => Promise<void>;
  onAllowMessaging?: () => Promise<void>;
  onBlockMessaging?: () => Promise<void>;
  messagingStatus?: "allowed" | "blocked" | "pending";
}

export function Messaging({
  sessionId,
  sessionTitle,
  recipientId,
  recipientName,
  isFormateur,
  messages,
  onSendMessage,
  onAllowMessaging,
  onBlockMessaging,
  messagingStatus = "allowed",
}: MessagingProps) {
  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<{ type: "pdf" | "link"; name: string; url: string }[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [pdfInput, setPdfInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() && attachments.length === 0) return;
    setSending(true);
    try {
      await onSendMessage(messageText, attachments);
      setMessageText("");
      setAttachments([]);
      setShowAttachmentMenu(false);
    } finally {
      setSending(false);
    }
  };

  const addLink = () => {
    if (linkInput.trim()) {
      setAttachments([...attachments, { type: "link", name: linkInput.split("/").pop() || linkInput, url: linkInput }]);
      setLinkInput("");
    }
  };

  const addPdf = () => {
    if (pdfInput.trim()) {
      setAttachments([...attachments, { type: "pdf", name: pdfInput.split("/").pop() || "document.pdf", url: pdfInput }]);
      setPdfInput("");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-[600px] rounded-3xl border border-white/10 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-background/50">
        <div>
          <h3 className="text-white font-bold">{sessionTitle}</h3>
          <p className="text-xs text-muted-foreground">{recipientName}</p>
        </div>
        {isFormateur && messagingStatus === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={onAllowMessaging}
              className="flex items-center gap-1 h-9 px-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium hover:bg-green-500/30 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Autoriser
            </button>
            <button
              onClick={onBlockMessaging}
              className="flex items-center gap-1 h-9 px-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-medium hover:bg-red-500/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Refuser
            </button>
          </div>
        )}
        {messagingStatus === "blocked" && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
            <X className="w-3.5 h-3.5" /> Communication bloquée
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <Clock className="w-10 h-10 text-white/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucun message pour le moment</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.senderId === recipientId ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-xs rounded-2xl p-3 ${msg.senderId === recipientId ? "bg-white/10" : "bg-primary/30"}`}>
                <p className="text-xs font-semibold text-muted-foreground mb-1">{msg.senderName}</p>
                <p className="text-sm text-white">{msg.content}</p>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {msg.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 bg-white/5 rounded-lg p-2 transition-colors"
                      >
                        {att.type === "pdf" ? <FileText className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
                        {att.name}
                      </a>
                    ))}
                  </div>
                )}
                <p className="text-xs text-white/30 mt-2">{new Date(msg.createdAt).toLocaleTimeString("fr-DZ")}</p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-white/5 bg-background/50 space-y-2">
          {attachments.map((att, i) => (
            <div key={i} className="flex items-center justify-between gap-2 text-xs text-muted-foreground bg-white/5 rounded-lg p-2">
              <div className="flex items-center gap-1.5">
                {att.type === "pdf" ? <FileText className="w-3 h-3 text-red-400" /> : <LinkIcon className="w-3 h-3 text-blue-400" />}
                {att.name}
              </div>
              <button onClick={() => removeAttachment(i)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Attachment Menu */}
      <AnimatePresence>
        {showAttachmentMenu && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/5 bg-background/50 p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ajouter un lien</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://exemple.com"
                  className="flex-1 h-8 rounded-lg bg-background border border-white/10 text-white px-2 text-xs focus:border-primary/50 focus:outline-none"
                  onKeyPress={(e) => e.key === "Enter" && addLink()}
                />
                <button onClick={addLink} className="h-8 px-3 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                  Ajouter
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ajouter un PDF</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={pdfInput}
                  onChange={(e) => setPdfInput(e.target.value)}
                  placeholder="https://exemple.com/document.pdf"
                  className="flex-1 h-8 rounded-lg bg-background border border-white/10 text-white px-2 text-xs focus:border-primary/50 focus:outline-none"
                  onKeyPress={(e) => e.key === "Enter" && addPdf()}
                />
                <button onClick={addPdf} className="h-8 px-3 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                  Ajouter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-background/50 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !sending && handleSendMessage()}
            placeholder="Écrivez votre message..."
            disabled={messagingStatus === "blocked"}
            className="flex-1 h-10 rounded-full bg-background border border-white/10 text-white px-4 text-sm focus:border-primary/50 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            disabled={messagingStatus === "blocked"}
            className="h-10 px-4 bg-white/5 text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && attachments.length === 0) || sending || messagingStatus === "blocked"}
            className="h-10 px-4 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
