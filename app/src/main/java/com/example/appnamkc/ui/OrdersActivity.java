package com.example.appnamkc.ui;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.appnamkc.R;
import com.example.appnamkc.adapter.OrderAdapter;
import com.example.appnamkc.api.ApiClient;

import java.util.ArrayList;

public class OrdersActivity extends AppCompatActivity {

    private static final String PREFS = "auth";
    private static final String KEY_EMAIL = "email";

    private TextView tvEmptyOrders;
    private ListView lvOrders;
    private OrderAdapter adapter;
    private ArrayList<ApiClient.ApiOrder> orders = new ArrayList<>();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_orders);

        tvEmptyOrders = findViewById(R.id.tvEmptyOrders);
        lvOrders = findViewById(R.id.lvOrders);

        adapter = new OrderAdapter(this, orders);
        lvOrders.setAdapter(adapter);

        loadOrders();
    }

    private void loadOrders() {
        SharedPreferences prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        String email = prefs.getString(KEY_EMAIL, "");

        if (email.isEmpty()) {
            tvEmptyOrders.setText("Bạn chưa đăng nhập.");
            tvEmptyOrders.setVisibility(View.VISIBLE);
            return;
        }

        tvEmptyOrders.setText("Đang tải đơn hàng...");
        tvEmptyOrders.setVisibility(View.VISIBLE);

        ApiClient.getUserOrders(email, new ApiClient.ApiCallback<ArrayList<ApiClient.ApiOrder>>() {
            @Override
            public void onSuccess(ArrayList<ApiClient.ApiOrder> data) {
                if (data.isEmpty()) {
                    tvEmptyOrders.setText("Bạn chưa có đơn hàng nào.");
                    tvEmptyOrders.setVisibility(View.VISIBLE);
                    orders.clear();
                    adapter.updateData(orders);
                } else {
                    tvEmptyOrders.setVisibility(View.GONE);
                    orders = data;
                    adapter.updateData(orders);
                }
            }

            @Override
            public void onError(String message) {
                tvEmptyOrders.setText("Không tải được đơn hàng: " + message);
                tvEmptyOrders.setVisibility(View.VISIBLE);
                Toast.makeText(OrdersActivity.this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }
}

