package com.waldher.variantec.service;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import com.google.cloud.vertexai.generativeai.ChatSession;
import com.google.cloud.vertexai.api.Content;
import com.google.cloud.vertexai.api.Part;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import com.waldher.variantec.repository.BookingRepository;
import com.waldher.variantec.model.Booking;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private static final String PROJECT_ID = "waldher-zahnarzt";
    private static final String LOCATION = "global"; 
    private static final String MODEL_NAME = "gemini-3-flash-preview";

    private static final String SYSTEM_INSTRUCTION = """
            Du bist ein freundlicher Assistent für 'Zahnarztreisen'. Deine Aufgabe ist es, Nutzer über Zahnbehandlungen im Ausland zu informieren und Termine zu vereinbaren.
            
            Um einen Termin zu buchen, musst du folgende Informationen vom Nutzer erfragen:
            - Name
            - E-Mail
            - Telefonnummer
            - Gewünschte Behandlung
            - Bevorzugtes Land (Ungarn, Polen, Türkei)
            - Bevorzugte Sprache des Behandlers (Deutsch, Englisch, Türkisch)
            - Bevorzugte Religion des Behandlers (Optional)
            
            Frage diese Informationen nacheinander ab oder sammle sie aus dem Gespräch.
            
            WICHTIG: Sobald du ALLE notwendigen Informationen hast (Name, Email, Telefon, Land, Sprache), 
            gib KEINEN TEXT mehr aus, sondern NUR einen JSON-Block im folgenden Format:
            
            ```json
            {
              "action": "BOOK_APPOINTMENT",
              "data": {
                "name": "...",
                "email": "...",
                "phone": "...",
                "country": "...",
                "language": "...",
                "religion": "..."
              }
            }
            ```
            """;

    private final BookingRepository bookingRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private VertexAI vertexAI;
    private GenerativeModel model;

    @PostConstruct
    public void init() {
        String apiEndpoint = "aiplatform.googleapis.com";
        if (!"global".equals(LOCATION)) {
            apiEndpoint = LOCATION + "-" + apiEndpoint;
        }

        this.vertexAI = new VertexAI.Builder()
                .setProjectId(PROJECT_ID)
                .setLocation(LOCATION)
                .setApiEndpoint(apiEndpoint)
                .build();

        this.model = new GenerativeModel(MODEL_NAME, vertexAI)
                .withSystemInstruction(Content.newBuilder()
                        .setRole("system")
                        .addParts(Part.newBuilder().setText(SYSTEM_INSTRUCTION).build())
                        .build());
    }

    @PreDestroy
    public void close() {
        if (this.vertexAI != null) {
            this.vertexAI.close();
        }
    }

    // Deprecated simple chat
    public String chat(String userMessage) throws IOException {
        GenerateContentResponse response = model.generateContent(userMessage);
        return ResponseHandler.getText(response);
    }

    public String processChat(List<Map<String, String>> history) throws IOException {
        System.out.println("DEBUG: processChat called with " + history.size() + " messages.");
        
        ChatSession chatSession = model.startChat();
        
        List<Content> historyContent = new java.util.ArrayList<>();
        String lastUserMessage = "";

        for (int i = 0; i < history.size(); i++) {
            Map<String, String> msg = history.get(i);
            String role = msg.get("role");
            String content = msg.get("content");
            
            if (i == history.size() - 1 && "user".equals(role)) {
                lastUserMessage = content;
            } else {
                if ("assistant".equals(role)) role = "model";
                
                historyContent.add(Content.newBuilder()
                        .setRole(role)
                        .addParts(Part.newBuilder().setText(content).build())
                        .build());
            }
        }
        
        System.out.println("DEBUG: Setting history size: " + historyContent.size());
        if (!historyContent.isEmpty()) {
            chatSession.setHistory(historyContent);
        }

        System.out.println("DEBUG: Sending last message: " + lastUserMessage);
        GenerateContentResponse response = chatSession.sendMessage(lastUserMessage);
        System.out.println("DEBUG: Response received: " + response);
        
        String textResponse = ResponseHandler.getText(response);
        System.out.println("DEBUG: Extracted text: " + textResponse);

        // Check for Booking JSON
        Pattern pattern = Pattern.compile("```json(.*?)```", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(textResponse);
        
        if (matcher.find()) {
            System.out.println("DEBUG: JSON block found.");
            String jsonBlock = matcher.group(1);
            try {
                Map<String, Object> jsonMap = objectMapper.readValue(jsonBlock, Map.class);
                
                if ("BOOK_APPOINTMENT".equals(jsonMap.get("action"))) {
                    Map<String, String> data = (Map<String, String>) jsonMap.get("data");
                    
                    Booking booking = new Booking();
                    booking.setEmail(data.get("email"));
                    booking.setPhone(data.get("phone"));
                    booking.setDesiredCountry(data.get("country"));
                    booking.setLanguage(data.get("language"));
                    booking.setDoctorReligion(data.get("religion"));
                    
                    if (booking.getLanguage() != null && !booking.getLanguage().equalsIgnoreCase("DE")) {
                        booking.setInterpreterNeeded(true);
                    }

                    bookingRepository.save(booking);
                    System.out.println("DEBUG: Booking saved.");
                    
                    return "Vielen Dank " + data.get("name") + "! Ich habe Ihren Termin für " + data.get("country") + " verbindlich angefragt. Sie erhalten eine Bestätigung per E-Mail.";
                }
            } catch (Exception e) {
                System.err.println("Booking JSON parse error: " + e.getMessage());
                e.printStackTrace();
            }
        }

        return textResponse;
    }
}
