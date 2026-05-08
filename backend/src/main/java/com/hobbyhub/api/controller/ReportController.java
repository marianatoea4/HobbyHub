package com.hobbyhub.api.controller;

import com.hobbyhub.api.dto.CreateReportRequest;
import com.hobbyhub.api.dto.ReportDTO;
import com.hobbyhub.api.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Creeaza un raport nou.
     * POST /api/reports
     */
    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody CreateReportRequest request) {
        try {
            ReportDTO report = reportService.createReport(request);
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Preia raportarile unui utilizator.
     * GET /api/reports/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReportDTO>> getReportsByUser(@PathVariable Long userId) {
        List<ReportDTO> reports = reportService.getReportsByUser(userId);
        return ResponseEntity.ok(reports);
    }
}
