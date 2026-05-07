package com.hobbyhub.api.service;

import com.hobbyhub.api.dto.CreateReportRequest;
import com.hobbyhub.api.dto.ReportDTO;
import com.hobbyhub.api.model.*;
import com.hobbyhub.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private EventRepository eventRepository;

    /**
     * Creeaza un raport nou.
     */
    public ReportDTO createReport(CreateReportRequest request) {
        // Validari de baza
        if (request.getReporterId() == null) {
            throw new RuntimeException("REPORTER_REQUIRED");
        }
        if (request.getReportType() == null || request.getReason() == null) {
            throw new RuntimeException("TYPE_AND_REASON_REQUIRED");
        }

        User reporter = userRepository.findById(request.getReporterId())
                .orElseThrow(() -> new RuntimeException("REPORTER_NOT_FOUND"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportType(request.getReportType());
        report.setReason(request.getReason());
        report.setDescription(request.getDescription());

        switch (request.getReportType()) {
            case "USER":
                if (request.getReportedUserId() == null) {
                    throw new RuntimeException("REPORTED_USER_REQUIRED");
                }
                if (request.getReporterId().equals(request.getReportedUserId())) {
                    throw new RuntimeException("CANNOT_REPORT_SELF");
                }
                // Verificam duplicat
                if (reportRepository.existsByReporterAndReportedUser(request.getReporterId(), request.getReportedUserId())) {
                    throw new RuntimeException("ALREADY_REPORTED_USER");
                }
                User reportedUser = userRepository.findById(request.getReportedUserId())
                        .orElseThrow(() -> new RuntimeException("REPORTED_USER_NOT_FOUND"));
                report.setReportedUser(reportedUser);
                break;

            case "MESSAGE":
                if (request.getReportedMessageId() == null) {
                    throw new RuntimeException("REPORTED_MESSAGE_REQUIRED");
                }
                if (reportRepository.existsByReporterAndMessage(request.getReporterId(), request.getReportedMessageId())) {
                    throw new RuntimeException("ALREADY_REPORTED_MESSAGE");
                }
                Message reportedMessage = messageRepository.findById(request.getReportedMessageId())
                        .orElseThrow(() -> new RuntimeException("REPORTED_MESSAGE_NOT_FOUND"));
                report.setReportedMessage(reportedMessage);
                // Setam si userul raportat (cel care a trimis mesajul)
                report.setReportedUser(reportedMessage.getSender());
                break;

            case "EVENT":
                if (request.getReportedEventId() == null) {
                    throw new RuntimeException("REPORTED_EVENT_REQUIRED");
                }
                if (reportRepository.existsByReporterAndEvent(request.getReporterId(), request.getReportedEventId())) {
                    throw new RuntimeException("ALREADY_REPORTED_EVENT");
                }
                Event reportedEvent = eventRepository.findById(request.getReportedEventId())
                        .orElseThrow(() -> new RuntimeException("REPORTED_EVENT_NOT_FOUND"));
                report.setReportedEvent(reportedEvent);
                break;

            default:
                throw new RuntimeException("INVALID_REPORT_TYPE");
        }

        Report saved = reportRepository.save(report);
        return toDTO(saved);
    }

    /**
     * Preia raportarile facute de un utilizator.
     */
    public List<ReportDTO> getReportsByUser(Long userId) {
        List<Report> reports = reportRepository.findByReporterIdOrderByCreatedAtDesc(userId);
        List<ReportDTO> dtos = new ArrayList<>();
        for (Report r : reports) {
            dtos.add(toDTO(r));
        }
        return dtos;
    }

    /**
     * Converteste un Report entity in ReportDTO.
     */
    private ReportDTO toDTO(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setReportType(report.getReportType());
        dto.setReason(report.getReason());
        dto.setDescription(report.getDescription());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());

        if (report.getReportedUser() != null) {
            dto.setReportedUserName(
                report.getReportedUser().getFirstName() + " " + report.getReportedUser().getLastName()
            );
        }
        if (report.getReportedEvent() != null) {
            dto.setReportedEventTitle(report.getReportedEvent().getTitle());
        }
        if (report.getReportedMessage() != null) {
            String content = report.getReportedMessage().getContent();
            // Trunchiem mesajul la 80 de caractere
            dto.setReportedMessageContent(
                content.length() > 80 ? content.substring(0, 80) + "..." : content
            );
        }

        return dto;
    }
}
