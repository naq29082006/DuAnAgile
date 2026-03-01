package com.example.appnamkc.api;

/**
 * Cấu hình API - đổi BASE_URL khi chạy trên thiết bị thật (dùng IP máy tính)
 * Emulator: 10.0.2.2 = localhost của máy host
 */
public class ApiConfig {
    // Emulator: 10.0.2.2:3000 | Thiết bị thật: http://192.168.x.x:3000 (IP máy chạy server)
    public static final String BASE_URL = "http://192.168.0.123:3000";
}
