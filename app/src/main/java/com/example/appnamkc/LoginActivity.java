package com.example.appnamkc;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;

public class LoginActivity extends AppCompatActivity {

    private TextInputEditText etEmail, etPassword;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mAuth = FirebaseAuth.getInstance();

        etEmail = findViewById(R.id.et_email);
        etPassword = findViewById(R.id.et_password);

        // Đăng nhập
        findViewById(R.id.btn_login).setOnClickListener(v -> loginUser());

        // Quên mật khẩu
        findViewById(R.id.tv_forgot_password).setOnClickListener(v ->
                startActivity(new Intent(this, ForgotPasswordActivity.class)));

        // Chuyển đến đăng ký
        findViewById(R.id.tv_register_link).setOnClickListener(v ->
                startActivity(new Intent(this, RegisterActivity.class)));
    }

    private void loginUser() {
        final String email = etEmail.getText() != null ? etEmail.getText().toString().trim() : "";
        final String password = etPassword.getText() != null ? etPassword.getText().toString().trim() : "";

        if (TextUtils.isEmpty(email)) {
            etEmail.setError("Vui lòng nhập email");
            etEmail.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(password)) {
            etPassword.setError("Vui lòng nhập mật khẩu");
            etPassword.requestFocus();
            return;
        }

        if (password.length() < 6) {
            etPassword.setError("Mật khẩu phải có ít nhất 6 ký tự");
            etPassword.requestFocus();
            return;
        }

        findViewById(R.id.btn_login).setEnabled(false);
        findViewById(R.id.progress_bar).setVisibility(View.VISIBLE);

        try {
            mAuth.signInWithEmailAndPassword(email, password)
                    .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(Task<AuthResult> task) {
                            try {
                                findViewById(R.id.progress_bar).setVisibility(View.GONE);
                                findViewById(R.id.btn_login).setEnabled(true);

                                if (task.isSuccessful()) {
                                    Toast.makeText(LoginActivity.this, "Đăng nhập thành công!", Toast.LENGTH_SHORT).show();
                                    startActivity(new Intent(LoginActivity.this, MainActivity.class));
                                    finish();
                                } else {
                                    String errorMessage = "Đăng nhập thất bại";
                                    if (task.getException() != null) {
                                        String exceptionMsg = task.getException().getMessage();
                                        if (exceptionMsg != null) {
                                            if (exceptionMsg.contains("user-not-found") || exceptionMsg.contains("wrong-password")) {
                                                errorMessage = "Email hoặc mật khẩu không đúng";
                                            } else if (exceptionMsg.contains("invalid-email")) {
                                                errorMessage = "Email không hợp lệ";
                                            } else {
                                                errorMessage += ": " + exceptionMsg;
                                            }
                                        }
                                    }
                                    Toast.makeText(LoginActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
                                }
                            } catch (Exception e) {
                                Toast.makeText(LoginActivity.this, "Lỗi: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
        } catch (Exception e) {
            findViewById(R.id.progress_bar).setVisibility(View.GONE);
            findViewById(R.id.btn_login).setEnabled(true);
            Toast.makeText(this, "Lỗi kết nối: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }
}

