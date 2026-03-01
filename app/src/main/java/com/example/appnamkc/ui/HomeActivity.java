package com.example.appnamkc.ui;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.appnamkc.R;
import com.example.appnamkc.adapter.ProductAdapter;
import com.example.appnamkc.api.ApiClient;
import com.example.appnamkc.model.Product;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.textfield.TextInputEditText;

import java.util.ArrayList;
import java.util.Locale;

public class HomeActivity extends AppCompatActivity implements ProductAdapter.OnProductClickListener {

    private RecyclerView rvProducts;
    private TextInputEditText etSearch;
    private LinearLayout llCategories;
    private BottomNavigationView bottomNav;
    private TextView tvGreeting, tvCartBadge;
    private ImageView ivCart, ivMenu;

    private ProductAdapter productAdapter;
    private ArrayList<Product> allProducts;
    private ArrayList<Product> filteredProducts;
    private String selectedCategory = "Tất cả";
    private int cartCount = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        initViews();
        setupBottomNav();
        setupCategories();
        loadProducts();
        setupSearch();
        setupCart();
        setupGreeting();
    }

    private void initViews() {
        rvProducts = findViewById(R.id.rvProducts);
        etSearch = findViewById(R.id.etSearch);
        llCategories = findViewById(R.id.llCategories);
        bottomNav = findViewById(R.id.bottomNav);
        tvGreeting = findViewById(R.id.tvGreeting);
        tvCartBadge = findViewById(R.id.tvCartBadge);
        ivCart = findViewById(R.id.ivCart);
        ivMenu = findViewById(R.id.ivMenu);

        rvProducts.setLayoutManager(new GridLayoutManager(this, 2));
        allProducts = new ArrayList<>();
        filteredProducts = new ArrayList<>();
    }

    private void setupGreeting() {
        String email = getSharedPreferences("auth", MODE_PRIVATE).getString("email", "");
        if (email != null && !email.isEmpty()) {
            String username = email.split("@")[0];
            tvGreeting.setText("Xin chào, " + username + "!");
        }
    }

    private void setupCart() {
        ivCart.setOnClickListener(v -> {
            Toast.makeText(this, "Giỏ hàng (" + cartCount + " sản phẩm)", Toast.LENGTH_SHORT).show();
            // TODO: Navigate to cart activity
        });

        updateCartBadge();
    }

    private void updateCartBadge() {
        if (cartCount > 0) {
            tvCartBadge.setText(String.valueOf(cartCount));
            tvCartBadge.setVisibility(View.VISIBLE);
        } else {
            tvCartBadge.setVisibility(View.GONE);
        }
    }

    private void setupSearch() {
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterProducts(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void setupCategories() {
        String[] categories = {"Tất cả", "Burger", "Pizza", "Cơm", "Đồ uống"};
        
        for (String category : categories) {
            Button btn = new Button(this);
            btn.setText(category.toUpperCase());
            btn.setPadding(24, 12, 24, 12);
            btn.setTextSize(14);
            btn.setAllCaps(false);
            btn.setTag(category); // Store original category name
            
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
            );
            params.setMargins(0, 0, 12, 0);
            btn.setLayoutParams(params);
            
            // Style button
            if (category.equals("Tất cả")) {
                btn.setBackground(ContextCompat.getDrawable(this, R.drawable.btn_category_selected));
                btn.setTextColor(ContextCompat.getColor(this, android.R.color.white));
            } else {
                btn.setBackground(ContextCompat.getDrawable(this, R.drawable.btn_category_unselected));
                btn.setTextColor(ContextCompat.getColor(this, android.R.color.white));
            }
            
            btn.setOnClickListener(v -> {
                String clickedCategory = (String) v.getTag();
                selectedCategory = clickedCategory;
                // Update button styles
                for (int i = 0; i < llCategories.getChildCount(); i++) {
                    View child = llCategories.getChildAt(i);
                    if (child instanceof Button) {
                        Button b = (Button) child;
                        String btnCategory = (String) b.getTag();
                        if (btnCategory != null && btnCategory.equals(clickedCategory)) {
                            b.setBackground(ContextCompat.getDrawable(this, R.drawable.btn_category_selected));
                            b.setTextColor(ContextCompat.getColor(this, android.R.color.white));
                        } else {
                            b.setBackground(ContextCompat.getDrawable(this, R.drawable.btn_category_unselected));
                            b.setTextColor(ContextCompat.getColor(this, android.R.color.white));
                        }
                    }
                }
                filterProducts(etSearch.getText().toString());
            });
            
            llCategories.addView(btn);
        }
    }

    private void setupBottomNav() {
        bottomNav.setSelectedItemId(R.id.nav_home);
        bottomNav.setOnItemSelectedListener(item -> {
            if (item.getItemId() == R.id.nav_bestseller) {
                Toast.makeText(this, "Bán chạy", Toast.LENGTH_SHORT).show();
                // TODO: Navigate to bestseller
            } else if (item.getItemId() == R.id.nav_orders) {
                Toast.makeText(this, "Đơn hàng", Toast.LENGTH_SHORT).show();
                // TODO: Navigate to orders
            } else if (item.getItemId() == R.id.nav_profile) {
                Toast.makeText(this, "Tôi", Toast.LENGTH_SHORT).show();
                // TODO: Navigate to profile
            }
            return true;
        });
    }

    private void loadProducts() {
        allProducts.clear();
        // Thử lấy từ API backend (admin), nếu lỗi thì dùng dữ liệu mẫu
        ApiClient.getProducts(new ApiClient.ApiCallback<ArrayList<ApiClient.ApiProduct>>() {
            @Override
            public void onSuccess(ArrayList<ApiClient.ApiProduct> data) {
                for (ApiClient.ApiProduct p : data) {
                    allProducts.add(new Product(p.id, p.name, p.description, p.price, p.category, p.imageUrl));
                }
                applyFilterAndRefresh();
            }

            @Override
            public void onError(String message) {
                loadProductsFallback();
            }
        });
    }

    private void loadProductsFallback() {
        allProducts.clear();
        allProducts.add(new Product(1, "Burger Gà Giòn", 
                "Burger gà chiên giòn với sốt đặc biệt", 45000, "Burger", ""));
        allProducts.add(new Product(2, "Hamburger Bò", 
                "Hamburger thịt bò chất lượng cao cấp", 55000, "Burger", ""));
        allProducts.add(new Product(3, "Pizza Margherita", 
                "Pizza phô mai và cà chua tươi", 120000, "Pizza", ""));
        allProducts.add(new Product(4, "Pizza Hải Sản", 
                "Pizza với tôm, mực và các loại hải sản", 150000, "Pizza", ""));
        allProducts.add(new Product(5, "Cơm Gà Nướng", 
                "Cơm với gà nướng thơm ngon", 65000, "Cơm", ""));
        allProducts.add(new Product(6, "Cơm Sườn Nướng", 
                "Cơm với sườn nướng đậm đà", 75000, "Cơm", ""));
        allProducts.add(new Product(7, "Coca Cola", 
                "Nước ngọt có ga", 20000, "Đồ uống", ""));
        allProducts.add(new Product(8, "Nước Cam Ép", 
                "Nước cam tươi ép", 35000, "Đồ uống", ""));
        applyFilterAndRefresh();
    }

    private void applyFilterAndRefresh() {
        if (productAdapter == null) {
            productAdapter = new ProductAdapter(filteredProducts, this);
            rvProducts.setAdapter(productAdapter);
        }
        filterProducts(etSearch != null ? etSearch.getText().toString() : "");
    }

    private void filterProducts(String keyword) {
        filteredProducts.clear();
        
        for (Product product : allProducts) {
            boolean matchesCategory = selectedCategory.equals("Tất cả") || 
                                     product.getCategory().equals(selectedCategory);
            boolean matchesKeyword = keyword.isEmpty() || 
                                   product.getName().toLowerCase(Locale.getDefault())
                                       .contains(keyword.toLowerCase(Locale.getDefault())) ||
                                   product.getDescription().toLowerCase(Locale.getDefault())
                                       .contains(keyword.toLowerCase(Locale.getDefault()));
            
            if (matchesCategory && matchesKeyword) {
                filteredProducts.add(product);
            }
        }
        
        productAdapter.updateList(filteredProducts);
    }

    @Override
    public void onViewDetailsClick(Product product) {
        Intent intent = new Intent(this, ProductDetailActivity.class);
        intent.putExtra("product", product);
        startActivity(intent);
    }

    @Override
    public void onAddToCartClick(Product product) {
        cartCount++;
        updateCartBadge();
        Toast.makeText(this, "Đã thêm " + product.getName() + " vào giỏ hàng", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onFavoriteClick(Product product) {
        // Already handled in adapter
    }
}

