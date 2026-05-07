package com.hobbyhub.api.dto;

public class CreateReportRequest {
    private Long reporterId;
    private String reportType;     // USER, MESSAGE, EVENT
    private Long reportedUserId;   // pentru raport user
    private Long reportedMessageId; // pentru raport mesaj
    private Long reportedEventId;  // pentru raport eveniment
    private String reason;
    private String description;

    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public Long getReportedUserId() { return reportedUserId; }
    public void setReportedUserId(Long reportedUserId) { this.reportedUserId = reportedUserId; }

    public Long getReportedMessageId() { return reportedMessageId; }
    public void setReportedMessageId(Long reportedMessageId) { this.reportedMessageId = reportedMessageId; }

    public Long getReportedEventId() { return reportedEventId; }
    public void setReportedEventId(Long reportedEventId) { this.reportedEventId = reportedEventId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
