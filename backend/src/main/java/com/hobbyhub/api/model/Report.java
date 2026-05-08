package com.hobbyhub.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Cine raporteaza
    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    // Utilizatorul raportat (optional)
    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;

    // Mesajul raportat (optional)
    @ManyToOne
    @JoinColumn(name = "reported_message_id")
    private Message reportedMessage;

    // Evenimentul raportat (optional)
    @ManyToOne
    @JoinColumn(name = "reported_event_id")
    private Event reportedEvent;

    // Tipul raportului: USER, MESSAGE, EVENT
    @Column(nullable = false)
    private String reportType;

    // Motivul selectat din lista predefinita
    @Column(nullable = false)
    private String reason;

    // Detalii optionale
    @Column(columnDefinition = "TEXT")
    private String description;

    // Statusul raportului: PENDING, REVIEWED, DISMISSED
    @Column(nullable = false)
    private String status = "PENDING";

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getteri si setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getReporter() { return reporter; }
    public void setReporter(User reporter) { this.reporter = reporter; }

    public User getReportedUser() { return reportedUser; }
    public void setReportedUser(User reportedUser) { this.reportedUser = reportedUser; }

    public Message getReportedMessage() { return reportedMessage; }
    public void setReportedMessage(Message reportedMessage) { this.reportedMessage = reportedMessage; }

    public Event getReportedEvent() { return reportedEvent; }
    public void setReportedEvent(Event reportedEvent) { this.reportedEvent = reportedEvent; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
