package com.waldher.variantec.service;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class ChatbotService {

    private static final String PROJECT_ID = "waldher-zahnarzt";
    private static final String LOCATION = "global"; 
    private static final String MODEL_NAME = "gemini-3-pro-preview";

    public String chat(String userMessage) throws IOException {
        try (VertexAI vertexAI = new VertexAI(PROJECT_ID, LOCATION)) {
            GenerativeModel model = new GenerativeModel(MODEL_NAME, vertexAI);
            GenerateContentResponse response = model.generateContent(userMessage);
            return ResponseHandler.getText(response);
        }
    }
}
