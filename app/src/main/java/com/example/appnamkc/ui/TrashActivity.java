package com.example.appnamkc.ui;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appnamkc.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class TrashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_trash);

        BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setSelectedItemId(R.id.nav_trash);
        bottomNav.setOnItemSelectedListener(item -> {
            if (item.getItemId() == R.id.nav_category) {
                startActivity(new Intent(this, CategoryActivity.class));
                finish();
            } else if (item.getItemId() == R.id.nav_product) {
                startActivity(new Intent(this, ProductActivity.class));
                finish();
            }
            return true;
        });
    }
}
