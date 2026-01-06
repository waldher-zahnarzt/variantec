package com.waldher.variantec.controller;

import com.waldher.variantec.service.ChatbotService;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.List;
import java.io.StringWriter;
import java.io.PrintWriter;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, Object> request) {
        try {
            if (request.containsKey("history")) {
                List<Map<String, String>> history = (List<Map<String, String>>) request.get("history");
                String response = chatbotService.processChat(history);
                if (response == null) {
                    return Map.of("error", "Response was null");
                }
                return Map.of("response", response);
            }
            
            String message = (String) request.get("message");
            String response = chatbotService.chat(message);
            return Map.of("response", response);
        } catch (Throwable e) {
            e.printStackTrace();
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            return Map.of("error", e.toString(), "stackTrace", sw.toString());
        }
    }
}
