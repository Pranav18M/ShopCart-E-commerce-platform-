package com.ecommerce.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
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
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String urlStr = "https://api.telegram.org/bot" + botToken
                    + "/sendMessage?chat_id=" + chatId
                    + "&text=" + encodedMessage
                    + "&parse_mode=Markdown";

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            conn.getResponseCode();
            conn.disconnect();
            System.out.println("Telegram notification sent!");
        } catch (IOException e) {
            System.out.println("Telegram error: " + e.getMessage());
        }
    }
}