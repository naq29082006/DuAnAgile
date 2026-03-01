package com.example.appnamkc.ui;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.example.appnamkc.R;
import com.example.appnamkc.api.ApiClient;
import com.google.android.material.textfield.TextInputEditText;

public class ForgotPasswordActivity extends AppCompatActivity {

    private TextInputEditText etEmail;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);

        etEmail = findViewById(R.id.et_email);
        findViewById(R.id.btn_back).setOnClickListener(v -> finish());
        findViewById(R.id.btn_send_request).setOnClickListener(v -> sendRequest());
    }

    private void sendRequest() {
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

        ApiClient.forgotPassword(email, new ApiClient.ApiCallback<ApiClient.ForgotPasswordResult>() {
            @Override
            public void onSuccess(ApiClient.ForgotPasswordResult result) {
                findViewById(R.id.progress_bar).setVisibility(View.GONE);
                findViewById(R.id.btn_send_request).setEnabled(true);
                showNewPasswordDialog(result.password);
            }

            @Override
            public void onError(String message) {
                findViewById(R.id.progress_bar).setVisibility(View.GONE);
                findViewById(R.id.btn_send_request).setEnabled(true);
                Toast.makeText(ForgotPasswordActivity.this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showNewPasswordDialog(String newPassword) {
        new AlertDialog.Builder(this)
                .setTitle("Mật khẩu mới")
                .setMessage("Mật khẩu tạm của bạn: " + newPassword + "\n\nVui lòng đổi mật khẩu sau khi đăng nhập.")
                .setPositiveButton("Sao chép", (d, w) -> {
                    ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                    if (cm != null) {
                        cm.setPrimaryClip(ClipData.newPlainText("password", newPassword));
                        Toast.makeText(this, "Đã sao chép mật khẩu", Toast.LENGTH_SHORT).show();
                    }
                    finish();
                })
                .setNegativeButton("Đóng", (d, w) -> finish())
                .setCancelable(false)
                .show();
    }
}
