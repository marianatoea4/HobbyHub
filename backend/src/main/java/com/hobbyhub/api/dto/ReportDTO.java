package com.hobbyhub.api.dto;

import java.time.LocalDateTime;

public class ReportDTO {
    private Long id;
    private String reportType;
    private String reason;
    private String description;
    private String status;
    private LocalDateTime createdAt;

    // Info despre ce a fost raportat
    private String reportedUserName;
    private String reportedEventTitle;
    private String reportedMessageContent;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getReportedUserName() { return reportedUserName; }
    public void setReportedUserName(String reportedUserName) { this.reportedUserName = reportedUserName; }

    public String getReportedEventTitle() { return reportedEventTitle; }
    public void setReportedEventTitle(String reportedEventTitle) { this.reportedEventTitle = reportedEventTitle; }

    public String getReportedMessageContent() { return reportedMessageContent; }
    public void setReportedMessageContent(String reportedMessageContent) { this.reportedMessageContent = reportedMessageContent; }
}
