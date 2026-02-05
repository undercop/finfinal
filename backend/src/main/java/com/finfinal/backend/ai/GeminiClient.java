package com.finfinal.backend.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    @Value("${gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String ask(String prompt) {
        // 1. Added :generateContent to the URL
        // 2. Used gemini-1.5-flash (standard stable-ish beta)
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.2,
                        "maxOutputTokens", 2000
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return extractText(response.getBody());
        } catch (Exception e) {
            // Log the error to see if it's a 400 (Bad Request) or 403 (Invalid Key)
            return "Error: " + e.getMessage();
        }
    }

    private String extractText(Map body) {
        var candidates = (List<Map>) body.get("candidates");
        var content = (Map) candidates.get(0).get("content");
        var parts = (List<Map>) content.get("parts");
        return (String) parts.get(0).get("text");
    }
}