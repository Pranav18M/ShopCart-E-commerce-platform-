package com.ecommerce.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class TelegramService {

    @Value("${app.telegram.bot-token}")
    private String botToken;

    @Value("${app.telegram.chat-id}")
    private String chatId;

    public void sendMessage(String message) {
        try {
            // Remove special markdown chars that break Telegram API
            String cleanMessage = message
                    .replace("*", "")
                    .replace("_", " ")
                    .replace("[", "")
                    .replace("]", "")
                    .replace("`", "");

            String encodedMessage = URLEncoder.encode(cleanMessage, StandardCharsets.UTF_8);
            String urlStr = "https://api.telegram.org/bot" + botToken
                    + "/sendMessage?chat_id=" + chatId
                    + "&text=" + encodedMessage;

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);

            int responseCode = conn.getResponseCode();

            // Read response for debugging
            BufferedReader br;
            if (responseCode == 200) {
                br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                System.out.println("Telegram notification sent! Response: " + responseCode);
            } else {
                br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) response.append(line);
                System.out.println("Telegram FAILED! Code: " + responseCode + " Response: " + response);
            }
            br.close();
            conn.disconnect();

        } catch (IOException e) {
            System.out.println("Telegram error: " + e.getMessage());
        }
    }
}
