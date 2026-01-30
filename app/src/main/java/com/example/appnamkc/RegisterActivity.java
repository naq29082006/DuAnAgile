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

public class RegisterActivity extends AppCompatActivity {

    private TextInputEditText etEmail, etPassword, etConfirmPassword;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        mAuth = FirebaseAuth.getInstance();

        etEmail = findViewById(R.id.et_email);
        etPassword = findViewById(R.id.et_password);
        etConfirmPassword = findViewById(R.id.et_confirm_password);

        // Đăng ký
        findViewById(R.id.btn_register).setOnClickListener(v -> registerUser());

        // Chuyển đến đăng nhập
        findViewById(R.id.tv_login_link).setOnClickListener(v ->
                startActivity(new Intent(this, LoginActivity.class)));
    }

    private void registerUser() {
        final String email = etEmail.getText() != null ? etEmail.getText().toString().trim() : "";
        final String password = etPassword.getText() != null ? etPassword.getText().toString().trim() : "";
        final String confirmPassword = etConfirmPassword.getText() != null ? etConfirmPassword.getText().toString().trim() : "";

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

        if (TextUtils.isEmpty(confirmPassword)) {
            etConfirmPassword.setError("Vui lòng xác nhận mật khẩu");
            etConfirmPassword.requestFocus();
            return;
        }

        if (!password.equals(confirmPassword)) {
            etConfirmPassword.setError("Mật khẩu không khớp");
            etConfirmPassword.requestFocus();
            return;
        }

        findViewById(R.id.btn_register).setEnabled(false);
        findViewById(R.id.progress_bar).setVisibility(View.VISIBLE);

        try {
            mAuth.createUserWithEmailAndPassword(email, password)
                    .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(Task<AuthResult> task) {
                            try {
                                findViewById(R.id.progress_bar).setVisibility(View.GONE);
                                findViewById(R.id.btn_register).setEnabled(true);

                                if (task.isSuccessful()) {
                                    Toast.makeText(RegisterActivity.this, "Đăng ký thành công!", Toast.LENGTH_SHORT).show();
                                    startActivity(new Intent(RegisterActivity.this, LoginActivity.class));
                                    finish();
                                } else {
                                    String errorMessage = "Đăng ký thất bại";
                                    if (task.getException() != null) {
                                        String exceptionMsg = task.getException().getMessage();
                                        if (exceptionMsg != null) {
                                            if (exceptionMsg.contains("email-already-in-use")) {
                                                errorMessage = "Email này đã được sử dụng";
                                            } else if (exceptionMsg.contains("weak-password")) {
                                                errorMessage = "Mật khẩu quá yếu";
                                            } else {
                                                errorMessage += ": " + exceptionMsg;
                                            }
                                        }
                                    }
                                    Toast.makeText(RegisterActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
                                }
                            } catch (Exception e) {
                                Toast.makeText(RegisterActivity.this, "Lỗi: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
        } catch (Exception e) {
            findViewById(R.id.progress_bar).setVisibility(View.GONE);
            findViewById(R.id.btn_register).setEnabled(true);
            Toast.makeText(this, "Lỗi kết nối: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }
}

