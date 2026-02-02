package com.example.appnamkc.ui;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appnamkc.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseAuth;

public class ForgotPasswordActivity extends AppCompatActivity {

    private TextInputEditText etEmail;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);

        mAuth = FirebaseAuth.getInstance();

        etEmail = findViewById(R.id.et_email);

        // Nút quay lại
        findViewById(R.id.btn_back).setOnClickListener(v -> finish());

        // Gửi yêu cầu
        findViewById(R.id.btn_send_request).setOnClickListener(v -> sendPasswordResetEmail());
    }

    private void sendPasswordResetEmail() {
        final String email = etEmail.getText() != null ? etEmail.getText().toString().trim() : "";

        if (TextUtils.isEmpty(email)) {
            etEmail.setError("Vui lòng nhập email");
            etEmail.requestFocus();
            return;
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.setError("Email không hợp lệ");
            etEmail.requestFocus();
            return;
        }

        findViewById(R.id.btn_send_request).setEnabled(false);
        findViewById(R.id.progress_bar).setVisibility(View.VISIBLE);

        try {
            mAuth.sendPasswordResetEmail(email)
                    .addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(Task<Void> task) {
                            try {
                                findViewById(R.id.progress_bar).setVisibility(View.GONE);
                                findViewById(R.id.btn_send_request).setEnabled(true);

                                if (task.isSuccessful()) {
                                    Toast.makeText(ForgotPasswordActivity.this, 
                                            "Email khôi phục mật khẩu đã được gửi đến " + email, 
                                            Toast.LENGTH_LONG).show();
                                    finish();
                                } else {
                                    String errorMessage = "Gửi email thất bại";
                                    if (task.getException() != null) {
                                        String exceptionMsg = task.getException().getMessage();
                                        if (exceptionMsg != null) {
                                            if (exceptionMsg.contains("user-not-found")) {
                                                errorMessage = "Email không tồn tại trong hệ thống";
                                            } else {
                                                errorMessage += ": " + exceptionMsg;
                                            }
                                        }
                                    }
                                    Toast.makeText(ForgotPasswordActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
                                }
                            } catch (Exception e) {
                                Toast.makeText(ForgotPasswordActivity.this, "Lỗi: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
        } catch (Exception e) {
            findViewById(R.id.progress_bar).setVisibility(View.GONE);
            findViewById(R.id.btn_send_request).setEnabled(true);
            Toast.makeText(this, "Lỗi kết nối: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }
}

