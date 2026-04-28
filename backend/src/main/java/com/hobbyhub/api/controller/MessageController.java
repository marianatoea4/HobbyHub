package com.hobbyhub.api.controller;

import com.hobbyhub.api.dto.ConversationPartnerDTO;
import com.hobbyhub.api.dto.MessageDTO;
import com.hobbyhub.api.dto.SendMessageRequest;
import com.hobbyhub.api.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageService messageService;

    /**
     * POST /api/messages/send
     * Trimite un mesaj nou.
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request) {
        try {
            MessageDTO message = messageService.sendMessage(
                    request.getSenderId(),
                    request.getReceiverId(),
                    request.getContent(),
                    request.getEventId()
            );
            return ResponseEntity.status(201).body(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET /api/messages/conversation/{otherUserId}?currentUserId={id}&eventId={id}
     * Preia conversatia cu un alt utilizator pentru un anumit eveniment.
     */
    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<?> getConversation(
            @PathVariable Long otherUserId,
            @RequestParam Long currentUserId,
            @RequestParam Long eventId) {
        try {
            List<MessageDTO> conversation = messageService.getConversation(currentUserId, otherUserId, eventId);
            return ResponseEntity.ok(conversation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET /api/messages/inbox?userId={id}
     * Returneaza lista conversatiilor grupate per (partener, eveniment).
     */
    @GetMapping("/inbox")
    public ResponseEntity<?> getInbox(@RequestParam Long userId) {
        try {
            List<ConversationPartnerDTO> partners = messageService.getConversationPartners(userId);
            return ResponseEntity.ok(partners);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET /api/messages/unread?userId={id}
     * Returneaza numarul total de mesaje necitite.
     */
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadCount(@RequestParam Long userId) {
        try {
            long count = messageService.getUnreadCount(userId);
            return ResponseEntity.ok(Map.of("unreadCount", count));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
