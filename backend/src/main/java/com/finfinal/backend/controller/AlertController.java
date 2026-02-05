package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.CriticalAlertDto;
import com.finfinal.backend.service.CriticalAlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:5173")
public class AlertController {

    private final CriticalAlertService service;

    public AlertController(CriticalAlertService service) {
        this.service = service;
    }

    @GetMapping("/critical")
    public List<CriticalAlertDto> getCriticalAlerts() {
        return service.getCriticalAlerts();
    }
}


