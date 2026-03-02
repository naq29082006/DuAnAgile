package com.example.appnamkc.ui;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.appnamkc.R;

public class ProfileActivity extends AppCompatActivity {

    private static final String PREFS = "auth";
    private static final String KEY_EMAIL = "email";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        TextView tvEmail = findViewById(R.id.tvEmail);
        Button btnEditProfile = findViewById(R.id.btnEditProfile);
        Button btnLogout = findViewById(R.id.btnLogout);

        SharedPreferences prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        String email = prefs.getString(KEY_EMAIL, "");
        tvEmail.setText(email.isEmpty() ? "Chưa đăng nhập" : email);

        btnEditProfile.setOnClickListener(v ->
                Toast.makeText(this, "Chức năng chỉnh sửa hồ sơ sẽ được cập nhật sau.", Toast.LENGTH_SHORT).show()
        );

        btnLogout.setOnClickListener(v -> {
            prefs.edit().clear().apply();
            Intent intent = new Intent(this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
        });
    }
}

