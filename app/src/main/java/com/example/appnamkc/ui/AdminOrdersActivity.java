package com.example.appnamkc.ui;

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
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;

public class AdminOrdersActivity extends AppCompatActivity {

    private TextView tvEmptyOrders;
    private ListView lvOrders;
    private OrderAdapter adapter;
    private ArrayList<ApiClient.ApiOrder> orders = new ArrayList<>();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_orders);

        tvEmptyOrders = findViewById(R.id.tvEmptyOrders);
        lvOrders = findViewById(R.id.lvOrders);
        adapter = new OrderAdapter(this, orders);
        lvOrders.setAdapter(adapter);

        BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setSelectedItemId(R.id.nav_orders_admin);
        bottomNav.setOnItemSelectedListener(item -> {
            if (item.getItemId() == R.id.nav_category) {
                startActivity(new android.content.Intent(this, CategoryActivity.class));
                finish();
            } else if (item.getItemId() == R.id.nav_product) {
                startActivity(new android.content.Intent(this, ProductActivity.class));
                finish();
            } else if (item.getItemId() == R.id.nav_trash) {
                startActivity(new android.content.Intent(this, TrashActivity.class));
                finish();
            }
            return true;
        });

        loadAdminOrders();
    }

    private void loadAdminOrders() {
        tvEmptyOrders.setText("Đang tải đơn hàng...");
        tvEmptyOrders.setVisibility(View.VISIBLE);

        ApiClient.getAdminOrders(new ApiClient.ApiCallback<ArrayList<ApiClient.ApiOrder>>() {
            @Override
            public void onSuccess(ArrayList<ApiClient.ApiOrder> data) {
                if (data.isEmpty()) {
                    tvEmptyOrders.setText("Chưa có đơn hàng nào.");
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
                Toast.makeText(AdminOrdersActivity.this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }
}

