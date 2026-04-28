package com.hobbyhub.api.service;

import com.hobbyhub.api.dto.ConversationPartnerDTO;
import com.hobbyhub.api.dto.MessageDTO;
import com.hobbyhub.api.model.Event;
import com.hobbyhub.api.model.Message;
import com.hobbyhub.api.model.User;
import com.hobbyhub.api.repository.EventRepository;
import com.hobbyhub.api.repository.MessageRepository;
import com.hobbyhub.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    /**
     * Trimite un mesaj nou de la sender catre receiver, legat de un eveniment.
     */
    public MessageDTO sendMessage(Long senderId, Long receiverId, String content, Long eventId) {
        // Validari
        if (content == null || content.isBlank()) {
            throw new RuntimeException("EMPTY_MESSAGE");
        }

        if (senderId.equals(receiverId)) {
            throw new RuntimeException("CANNOT_MESSAGE_SELF");
        }

        if (eventId == null) {
            throw new RuntimeException("EVENT_REQUIRED");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("SENDER_NOT_FOUND"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("RECEIVER_NOT_FOUND"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("EVENT_NOT_FOUND"));

        // Cream mesajul
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setEvent(event);
        message.setContent(content.trim());
        message.setSentAt(LocalDateTime.now());
        message.setIsRead(false);

        Message saved = messageRepository.save(message);
        return toDTO(saved);
    }

    /**
     * Preia conversatia completa dintre doi utilizatori pentru un anumit eveniment.
     * Marcheaza automat mesajele primite ca citite.
     */
    public List<MessageDTO> getConversation(Long currentUserId, Long otherUserId, Long eventId) {
        // Marcam mesajele primite ca citite
        List<Message> unread = messageRepository.findUnreadFromSenderForEvent(otherUserId, currentUserId, eventId);
        for (Message m : unread) {
            m.setIsRead(true);
        }
        if (!unread.isEmpty()) {
            messageRepository.saveAll(unread);
        }

        // Preluam toata conversatia
        List<Message> messages = messageRepository.findConversationByEvent(currentUserId, otherUserId, eventId);
        List<MessageDTO> dtos = new ArrayList<>();
        for (Message m : messages) {
            dtos.add(toDTO(m));
        }
        return dtos;
    }

    /**
     * Returneaza lista tuturor conversatiilor unui utilizator,
     * grupate per (partener, eveniment).
     */
    public List<ConversationPartnerDTO> getConversationPartners(Long userId) {
        List<Message> allMessages = messageRepository.findAllMessagesForUser(userId);

        // Grupam dupa cheia (partnerId, eventId)
        Map<String, ConversationPartnerDTO> conversationMap = new LinkedHashMap<>();

        for (Message msg : allMessages) {
            Long partnerId = msg.getSender().getId().equals(userId)
                    ? msg.getReceiver().getId()
                    : msg.getSender().getId();

            Long eventId = msg.getEvent() != null ? msg.getEvent().getId() : null;
            if (eventId == null) continue; // sarim mesajele fara eveniment

            String key = partnerId + "-" + eventId;

            if (!conversationMap.containsKey(key)) {
                User partner = msg.getSender().getId().equals(userId) ? msg.getReceiver() : msg.getSender();

                ConversationPartnerDTO dto = new ConversationPartnerDTO();
                dto.setUserId(partner.getId());
                dto.setFirstName(partner.getFirstName());
                dto.setLastName(partner.getLastName());
                dto.setProfilePicture(partner.getProfilePicture());
                dto.setEventId(eventId);
                dto.setEventTitle(msg.getEvent().getTitle());
                dto.setLastMessage(msg.getContent());
                dto.setLastMessageTime(msg.getSentAt());
                dto.setUnreadCount(
                        messageRepository.countUnreadFromSenderForEvent(userId, partnerId, eventId)
                );

                conversationMap.put(key, dto);
            }
            // Nu actualizam pentru mesaje mai vechi fiindca sunt deja ordonate DESC
        }

        // Sortam dupa ultimul mesaj (cel mai recent primul)
        List<ConversationPartnerDTO> partners = new ArrayList<>(conversationMap.values());
        partners.sort(Comparator.comparing(
                ConversationPartnerDTO::getLastMessageTime,
                Comparator.nullsLast(Comparator.reverseOrder())
        ));

        return partners;
    }

    /**
     * Returneaza numarul total de mesaje necitite.
     */
    public long getUnreadCount(Long userId) {
        return messageRepository.countUnreadMessages(userId);
    }

    /**
     * Converteste un Message entity intr-un MessageDTO.
     */
    private MessageDTO toDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFirstName() + " " + message.getSender().getLastName());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        dto.setIsRead(message.getIsRead());

        if (message.getEvent() != null) {
            dto.setEventId(message.getEvent().getId());
            dto.setEventTitle(message.getEvent().getTitle());
        }

        return dto;
    }
}
