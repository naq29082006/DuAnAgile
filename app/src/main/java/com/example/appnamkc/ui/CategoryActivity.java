package com.example.appnamkc.ui;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.*;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appnamkc.R;
import com.example.appnamkc.adapter.CategoryAdapter;
import com.example.appnamkc.db.DatabaseHelper;
import com.example.appnamkc.model.Category;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;

public class CategoryActivity extends AppCompatActivity {

    ListView lv;
    EditText edtSearch;
    Spinner spSort;
    FloatingActionButton fabAdd;
    BottomNavigationView bottomNav;

    DatabaseHelper db;
    ArrayList<Category> list;
    CategoryAdapter adapter;

    String sort = "ASC";

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        setContentView(R.layout.activity_category);

        lv = findViewById(R.id.lvCategory);
        edtSearch = findViewById(R.id.edtSearch);
        spSort = findViewById(R.id.spSort);
        fabAdd = findViewById(R.id.fabAdd);
        bottomNav = findViewById(R.id.bottomNav);

        db = new DatabaseHelper(this);

        setupBottomNav();
        setupSort();
        load("");

        edtSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s,int a,int b,int c){}
            @Override public void afterTextChanged(Editable e){}
            @Override
            public void onTextChanged(CharSequence s, int a, int b, int c) {
                load(s.toString());
            }
        });

        fabAdd.setOnClickListener(v ->
                Toast.makeText(this, "Mở màn thêm danh mục", Toast.LENGTH_SHORT).show()
        );
    }

    void setupBottomNav() {
        bottomNav.setSelectedItemId(R.id.nav_category);
        bottomNav.setOnItemSelectedListener(item -> {
            if (item.getItemId() == R.id.nav_product) {
                startActivity(new Intent(this, ProductActivity.class));
            } else if (item.getItemId() == R.id.nav_trash) {
                startActivity(new Intent(this, TrashActivity.class));
            }
            return true;
        });
    }

    void setupSort() {
        ArrayAdapter<String> ad = new ArrayAdapter<>(
                this,
                android.R.layout.simple_spinner_item,
                new String[]{"A - Z", "Z - A"}
        );
        ad.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spSort.setAdapter(ad);

        spSort.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override public void onNothingSelected(AdapterView<?> parent) {}
            @Override
            public void onItemSelected(AdapterView<?> parent, android.view.View v, int i, long l) {
                sort = (i == 0) ? "ASC" : "DESC";
                load(edtSearch.getText().toString());
            }
        });
    }

    void load(String keyword) {
        list = db.getCategories(keyword, sort);
        adapter = new CategoryAdapter(this, list);
        lv.setAdapter(adapter);
    }
}
