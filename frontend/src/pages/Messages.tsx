import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Messages.css";

interface ConversationPartner {
  userId: number;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  eventId: number;
  eventTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessageItem {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  eventId: number | null;
  eventTitle: string | null;
}

export default function Messages() {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<ConversationPartner[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [selectedUserPic, setSelectedUserPic] = useState<string | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Preluam ID-ul utilizatorului curent din localStorage
  const getCurrentUserId = (): number | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr).id;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // Scroll automat la ultimul mesaj
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Incarca lista de conversatii (inbox)
  const fetchInbox = async () => {
    if (!currentUserId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/messages/inbox?userId=${currentUserId}`
      );
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Eroare la încărcarea inbox-ului:", error);
    }
  };

  // Incarca conversatia cu un utilizator pentru un eveniment
  const fetchConversation = async (otherUserId: number, eventId: number) => {
    if (!currentUserId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/messages/conversation/${otherUserId}?currentUserId=${currentUserId}&eventId=${eventId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        fetchInbox();
      }
    } catch (error) {
      console.error("Eroare la încărcarea conversației:", error);
    }
  };

  // La prima randare, verificam daca avem parametri din URL
  useEffect(() => {
    fetchInbox();

    const userIdParam = searchParams.get("userId");
    const eventIdParam = searchParams.get("eventId");

    if (userIdParam && eventIdParam) {
      const targetUserId = parseInt(userIdParam);
      const targetEventId = parseInt(eventIdParam);
      setSelectedUserId(targetUserId);
      setSelectedEventId(targetEventId);
      fetchConversation(targetUserId, targetEventId);

      // Preluam numele evenimentului din backend
      fetch(`http://localhost:8080/api/events/all`)
        .then((res) => res.json())
        .then((events: any[]) => {
          const ev = events.find((e: any) => e.id === targetEventId);
          if (ev) setSelectedEventTitle(ev.title);
        })
        .catch(() => {});
    }
  }, []);

  // Cand se selecteaza o conversatie, actualizam datele
  useEffect(() => {
    if (selectedUserId && selectedEventId) {
      const partner = conversations.find(
        (c) => c.userId === selectedUserId && c.eventId === selectedEventId
      );
      if (partner) {
        setSelectedUserName(`${partner.firstName} ${partner.lastName}`);
        setSelectedEventTitle(partner.eventTitle);
        setSelectedUserPic(partner.profilePicture);
      }
    }
  }, [selectedUserId, selectedEventId, conversations]);

  // Scroll automat cand apar mesaje noi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling: verifica mesaje noi la fiecare 4 secunde
  useEffect(() => {
    const interval = setInterval(() => {
      fetchInbox();
      if (selectedUserId && selectedEventId) {
        fetchConversation(selectedUserId, selectedEventId);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedUserId, selectedEventId, currentUserId]);

  // Selecteaza o conversatie din inbox
  const handleSelectConversation = (partner: ConversationPartner) => {
    setSelectedUserId(partner.userId);
    setSelectedEventId(partner.eventId);
    setSelectedUserName(`${partner.firstName} ${partner.lastName}`);
    setSelectedEventTitle(partner.eventTitle);
    setSelectedUserPic(partner.profilePicture);
    fetchConversation(partner.userId, partner.eventId);
  };

  // Trimite un mesaj
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !selectedUserId || !selectedEventId)
      return;

    try {
      const response = await fetch("http://localhost:8080/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: selectedUserId,
          content: newMessage.trim(),
          eventId: selectedEventId,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchConversation(selectedUserId, selectedEventId);
        fetchInbox();
      }
    } catch (error) {
      console.error("Eroare la trimiterea mesajului:", error);
    }
  };

  // Trimite cu Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Formateaza ora
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "short",
    });
  };

  // Genereaza initialele pentru avatar
  const getInitials = (firstName: string, lastName: string) => {
    return (
      (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "")
    ).toUpperCase();
  };

  if (!currentUserId) {
    return (
      <div className="messages-wrapper">
        <Navbar />
        <div
          className="messages-page-container"
          style={{ paddingTop: "80px" }}
        >
          <p>Trebuie să fii autentificat pentru a vedea mesajele.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-wrapper">
      <Navbar />
      <div className="messages-page-container" style={{ paddingTop: "80px" }}>
        {/* Panel stanga: Lista de conversatii */}
        <div className="messages-inbox">
          <div className="inbox-header">
            <h2>Mesaje</h2>
            {conversations.reduce((sum, c) => sum + c.unreadCount, 0) > 0 && (
              <span className="inbox-total-badge">
                {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
              </span>
            )}
          </div>

          <div className="inbox-list">
            {conversations.length === 0 ? (
              <div className="inbox-empty">
                Nicio conversație încă.
                <br />
                Contactează un organizator din pagina de evenimente!
              </div>
            ) : (
              conversations.map((partner) => (
                <div
                  key={`${partner.userId}-${partner.eventId}`}
                  className={`conversation-item ${
                    selectedUserId === partner.userId &&
                    selectedEventId === partner.eventId
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleSelectConversation(partner)}
                >
                  <div className="conversation-avatar">
                    {partner.profilePicture ? (
                      <img
                        src={`http://localhost:8080${partner.profilePicture}`}
                        alt=""
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      getInitials(partner.firstName, partner.lastName)
                    )}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {partner.firstName} {partner.lastName}
                    </div>
                    <div className="conversation-event-tag">
                      {partner.eventTitle}
                    </div>
                    <div className="conversation-preview">
                      {partner.lastMessage || "Niciun mesaj"}
                    </div>
                  </div>
                  <div className="conversation-meta">
                    {partner.lastMessageTime && (
                      <span className="conversation-time">
                        {formatTime(partner.lastMessageTime)}
                      </span>
                    )}
                    {partner.unreadCount > 0 && (
                      <span className="conversation-unread-badge">
                        {partner.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel dreapta: Zona de chat */}
        <div className="chat-panel">
          {!selectedUserId || !selectedEventId ? (
            <div className="chat-placeholder">
              <span className="chat-placeholder-icon">💬</span>
              <p>Selectează o conversație din stânga</p>
            </div>
          ) : (
            <>
              {/* Header chat - cu numele evenimentului */}
              <div className="chat-header">
                <div className="chat-header-avatar">
                  {selectedUserPic ? (
                    <img
                      src={`http://localhost:8080${selectedUserPic}`}
                      alt=""
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    selectedUserName
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")
                      .toUpperCase()
                  )}
                </div>
                <div className="chat-header-info">
                  <h3>{selectedUserName}</h3>
                  <p>{selectedEventTitle}</p>
                </div>
              </div>

              {/* Mesaje */}
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="chat-placeholder">
                    <p>Trimite primul mesaj pentru a începe conversația!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-bubble ${
                        msg.senderId === currentUserId ? "sent" : "received"
                      }`}
                    >
                      {msg.content}
                      <div className="message-time">
                        {formatTime(msg.sentAt)}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input mesaj */}
              <div className="chat-input-container">
                <input
                  type="text"
                  placeholder="Scrie un mesaj..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button
                  className="chat-send-btn"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  Trimite
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
