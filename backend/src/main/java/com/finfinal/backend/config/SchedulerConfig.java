package com.finfinal.backend.config;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class SchedulerConfig {

    public static List<LocalDate> getLast365Days() {
        List<LocalDate> days = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Generate last 365 days (including today)
        for (int i = 0; i < 365; i++) {
            days.add(today.minusDays(i));
        }
        return days;
    }
}
