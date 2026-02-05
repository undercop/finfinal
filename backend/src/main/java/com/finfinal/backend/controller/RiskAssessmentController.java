package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.RiskAssessmentDto;
import com.finfinal.backend.service.AdvancedRiskAssessmentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class RiskAssessmentController {

    private final AdvancedRiskAssessmentService service;

    public RiskAssessmentController(AdvancedRiskAssessmentService service) {
        this.service = service;
    }

    @GetMapping("/risk")
    public RiskAssessmentDto getRiskAssessment() {
        return service.assess();
    }
}
