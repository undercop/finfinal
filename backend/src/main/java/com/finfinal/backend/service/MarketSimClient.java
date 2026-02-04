package com.finfinal.backend.service;

import com.finfinal.backend.DTO.SimulatedPriceDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class MarketSimClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String SIM_URL =
            "http://localhost:8081/simulate/prices";

    public List<SimulatedPriceDto> fetchPrices() {

        SimulatedPriceDto[] response =
                restTemplate.getForObject(SIM_URL, SimulatedPriceDto[].class);

        return Arrays.asList(response);
    }
}