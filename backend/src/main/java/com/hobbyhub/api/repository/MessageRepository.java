package com.hobbyhub.api.repository;

import com.hobbyhub.api.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Preia toate mesajele dintre doi utilizatori pentru un anumit eveniment
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1)) " +
           "AND m.event.id = :eventId " +
           "ORDER BY m.sentAt ASC")
    List<Message> findConversationByEvent(@Param("userId1") Long userId1,
                                          @Param("userId2") Long userId2,
                                          @Param("eventId") Long eventId);

    // Numara mesajele necitite totale
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :receiverId AND m.isRead = false")
    long countUnreadMessages(@Param("receiverId") Long receiverId);

    // Numara mesajele necitite de la un expeditor pentru un eveniment specific
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :receiverId AND m.sender.id = :senderId AND m.event.id = :eventId AND m.isRead = false")
    long countUnreadFromSenderForEvent(@Param("receiverId") Long receiverId,
                                       @Param("senderId") Long senderId,
                                       @Param("eventId") Long eventId);

    // Toate mesajele unui utilizator (pentru a le grupa in Java)
    @Query("SELECT m FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId ORDER BY m.sentAt DESC")
    List<Message> findAllMessagesForUser(@Param("userId") Long userId);

    // Ultimul mesaj dintr-o conversatie pe eveniment
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1)) " +
           "AND m.event.id = :eventId " +
           "ORDER BY m.sentAt DESC LIMIT 1")
    Message findLastMessageByEvent(@Param("userId1") Long userId1,
                                    @Param("userId2") Long userId2,
                                    @Param("eventId") Long eventId);

    // Mesaje necitite de la un expeditor pentru un eveniment (pentru a le marca ca citite)
    @Query("SELECT m FROM Message m WHERE m.sender.id = :senderId AND m.receiver.id = :receiverId AND m.event.id = :eventId AND m.isRead = false")
    List<Message> findUnreadFromSenderForEvent(@Param("senderId") Long senderId,
                                               @Param("receiverId") Long receiverId,
                                               @Param("eventId") Long eventId);
}
