package com.example.appnamkc;

import android.content.Intent;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.firebase.auth.FirebaseAuth;

public class MainActivity extends AppCompatActivity {

    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        try {
            mAuth = FirebaseAuth.getInstance();

            // Kiểm tra nếu chưa đăng nhập thì chuyển đến LoginActivity
            if (mAuth.getCurrentUser() == null) {
                startActivity(new Intent(this, LoginActivity.class));
                finish();
            }
        } catch (Exception e) {
            // Nếu có lỗi với Firebase, vẫn chuyển đến LoginActivity
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        }
    }
}