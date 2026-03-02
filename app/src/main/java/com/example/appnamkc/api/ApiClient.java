package com.example.appnamkc.api;

import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ApiClient {

    private static final OkHttpClient client = new OkHttpClient();
    private static final ExecutorService executor = Executors.newSingleThreadExecutor();
    private static final Handler mainHandler = new Handler(Looper.getMainLooper());
    private static final MediaType JSON = MediaType.parse("application/json");

    public interface ApiCallback<T> {
        void onSuccess(T data);
        void onError(String message);
    }

    /* ========================= PRODUCTS ========================= */

    public static void getProducts(ApiCallback<ArrayList<ApiProduct>> callback) {
        executor.execute(() -> {
            try {
                Request request = new Request.Builder()
                        .url(ApiConfig.BASE_URL + "/api/products")
                        .get()
                        .build();

                Response response = client.newCall(request).execute();

                if (!response.isSuccessful()) {
                    final String errorMsg = "HTTP " + response.code();
                    mainHandler.post(() -> callback.onError(errorMsg));
                    return;
                }

                String body = response.body() != null ? response.body().string() : "[]";
                JSONArray arr = new JSONArray(body);

                final ArrayList<ApiProduct> list = new ArrayList<>();

                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    list.add(new ApiProduct(
                            obj.optInt("id", 0),
                            obj.optString("name", ""),
                            obj.optString("description", ""),
                            obj.optDouble("price", 0),
                            obj.optString("category", ""),
                            obj.optString("imageUrl", "")
                    ));
                }

                mainHandler.post(() -> callback.onSuccess(list));

            } catch (Exception e) {
                final String errorMsg = e.getMessage() != null
                        ? e.getMessage()
                        : "Lỗi kết nối";
                mainHandler.post(() -> callback.onError(errorMsg));
            }
        });
    }

    /* ========================= CATEGORIES ========================= */

    public static void getCategories(ApiCallback<ArrayList<ApiCategory>> callback) {
        executor.execute(() -> {
            try {
                Request request = new Request.Builder()
                        .url(ApiConfig.BASE_URL + "/api/categories")
                        .get()
                        .build();

                Response response = client.newCall(request).execute();

                if (!response.isSuccessful()) {
                    final String errorMsg = "HTTP " + response.code();
                    mainHandler.post(() -> callback.onError(errorMsg));
                    return;
                }

                String body = response.body() != null ? response.body().string() : "[]";
                JSONArray arr = new JSONArray(body);

                final ArrayList<ApiCategory> list = new ArrayList<>();

                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    list.add(new ApiCategory(
                            obj.optInt("id", 0),
                            obj.optString("name", "")
                    ));
                }

                mainHandler.post(() -> callback.onSuccess(list));

            } catch (Exception e) {
                final String errorMsg = e.getMessage() != null
                        ? e.getMessage()
                        : "Lỗi kết nối";
                mainHandler.post(() -> callback.onError(errorMsg));
            }
        });
    }

    /* ========================= ORDERS ========================= */

    public static void getUserOrders(String email, ApiCallback<ArrayList<ApiOrder>> callback) {
        executor.execute(() -> {
            try {
                String url = ApiConfig.BASE_URL + "/api/orders?email=" + email;
                Request request = new Request.Builder()
                        .url(url)
                        .get()
                        .build();

                Response response = client.newCall(request).execute();

                if (!response.isSuccessful()) {
                    final String errorMsg = "HTTP " + response.code();
                    mainHandler.post(() -> callback.onError(errorMsg));
                    return;
                }

                String body = response.body() != null ? response.body().string() : "[]";
                JSONArray arr = new JSONArray(body);

                final ArrayList<ApiOrder> list = new ArrayList<>();

                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    list.add(new ApiOrder(
                            obj.optInt("id", 0),
                            obj.optString("userEmail", ""),
                            obj.optDouble("totalAmount", 0),
                            obj.optString("status", ""),
                            obj.optString("createdAt", "")
                    ));
                }

                mainHandler.post(() -> callback.onSuccess(list));

            } catch (Exception e) {
                final String errorMsg = e.getMessage() != null
                        ? e.getMessage()
                        : "Lỗi kết nối";
                mainHandler.post(() -> callback.onError(errorMsg));
            }
        });
    }

    public static void getAdminOrders(ApiCallback<ArrayList<ApiOrder>> callback) {
        executor.execute(() -> {
            try {
                Request request = new Request.Builder()
                        .url(ApiConfig.BASE_URL + "/api/admin/orders")
                        .get()
                        .build();

                Response response = client.newCall(request).execute();

                if (!response.isSuccessful()) {
                    final String errorMsg = "HTTP " + response.code();
                    mainHandler.post(() -> callback.onError(errorMsg));
                    return;
                }

                String body = response.body() != null ? response.body().string() : "[]";
                JSONArray arr = new JSONArray(body);

                final ArrayList<ApiOrder> list = new ArrayList<>();

                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    list.add(new ApiOrder(
                            obj.optInt("id", 0),
                            obj.optString("userEmail", ""),
                            obj.optDouble("totalAmount", 0),
                            obj.optString("status", ""),
                            obj.optString("createdAt", "")
                    ));
                }

                mainHandler.post(() -> callback.onSuccess(list));

            } catch (Exception e) {
                final String errorMsg = e.getMessage() != null
                        ? e.getMessage()
                        : "Lỗi kết nối";
                mainHandler.post(() -> callback.onError(errorMsg));
            }
        });
    }

    /* ========================= REGISTER ========================= */

    public static void register(String email, String password, ApiCallback<ApiUser> callback) {
        executor.execute(() -> {
            try {
                JSONObject json = new JSONObject();
                json.put("email", email);
                json.put("password", password);

                Request request = new Request.Builder()
                        .url(ApiConfig.BASE_URL + "/api/auth/register")
                        .post(RequestBody.create(json.toString(), JSON))
                        .build();

                Response response = client.newCall(request).execute();
                String bodyStr = response.body() != null ? response.body().string() : "{}";

                if (!response.isSuccessful()) {
                    String msg = "HTTP " + response.code();
                    try {
                        JSONObject err = new JSONObject(bodyStr);
                        msg = err.optString("error", msg);
                    } catch (Exception ignored) {}

                    final String errorMsg = msg;
                    mainHandler.post(() -> callback.onError(errorMsg));
                    return;
                }

                JSONObject obj = new JSONObject(bodyStr);

                final ApiUser user = new ApiUser(
                        obj.optInt("id", 0),
                        obj.optString("name", ""),
                        obj.optString("email", ""),
                        obj.optString("phone", "")
                );

                mainHandler.post(() -> callback.onSuccess(user));

            } catch (Exception e) {
                final String errorMsg = e.getMessage() != null
                        ? e.getMessage()
                        : "Lỗi kết nối";
                mainHandler.post(() -> callback.onError(errorMsg));
            }
        });
    }

    /* ========================= LOGIN ========================= */

    public static void login(String email, String password, ApiCallback<ApiUser> callback) {
        executor.execute(() -> {
            try {
                JSONObject json = new JSONObject();
                json.put("email", email);
                json.put("password", password);

                Request request = new Request.Builder()
                        .url(ApiConfig.BASE_URL + "/api/auth/login")
                        .post(RequestBody.create(json.toString(), JSON))
                        .build();

                Response response = client.newCall(request).execute();
                String bodyStr = response.body() != null ? response.body().string() : "{}";

                if (!response.isSuccessful()) {
                    String msg = "Email hoặc mật khẩu không đúng";
                    try {
                        JSONObject err = new JSONObject(bodyStr);
                        msg = err.optString("error", msg);
                    } catch (Exception ignored) {}

                    final String errorMsg = msg;
                    mainHandler.post(() -> callback.onError(errorMsg));
                    return;
                }

                JSONObject obj = new JSONObject(bodyStr);

                final ApiUser user = new ApiUser(
                        obj.optInt("id", 0),
                        obj.optString("name", ""),
                        obj.optString("email", ""),
                        obj.optString("phone", "")
                );

                mainHandler.post(() -> callback.onSuccess(user));

            } catch (Exception e) {
                final String errorMsg = e.getMessage() != null
                        ? e.getMessage()
                        : "Lỗi kết nối";
                mainHandler.post(() -> callback.onError(errorMsg));
            }
        });
    }

    /* ========================= FORGOT PASSWORD ========================= */

    public static void forgotPassword(String email, ApiCallback<ForgotPasswordResult> callback) {
        executor.execute(() -> {
            try {
                JSONObject json = new JSONObject();
                json.put("email", email);

                Request request = new Request.Builder()
                        .url(ApiConfig.BASE_URL + "/api/auth/forgot-password")
                        .post(RequestBody.create(json.toString(), JSON))
                        .build();

                Response response = client.newCall(request).execute();
                String bodyStr = response.body() != null ? response.body().string() : "{}";

                if (!response.isSuccessful()) {
                    String msg = "Email không tồn tại";
                    try {
                        JSONObject err = new JSONObject(bodyStr);
                        msg = err.optString("error", msg);
                    } catch (Exception ignored) {}

                    final String errorMsg = msg;
                    mainHandler.post(() -> callback.onError(errorMsg));
                    return;
                }

                JSONObject obj = new JSONObject(bodyStr);

                final ForgotPasswordResult result =
                        new ForgotPasswordResult(
                                obj.optString("message", ""),
                                obj.optString("password", "")
                        );

                mainHandler.post(() -> callback.onSuccess(result));

            } catch (Exception e) {
                final String errorMsg = e.getMessage() != null
                        ? e.getMessage()
                        : "Lỗi kết nối";
                mainHandler.post(() -> callback.onError(errorMsg));
            }
        });
    }

    /* ========================= MODELS ========================= */

    public static class ApiProduct {
        public int id;
        public String name, description, category, imageUrl;
        public double price;

        public ApiProduct(int id, String name, String description,
                          double price, String category, String imageUrl) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
            this.category = category;
            this.imageUrl = imageUrl;
        }
    }

    public static class ApiCategory {
        public int id;
        public String name;

        public ApiCategory(int id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    public static class ApiUser {
        public int id;
        public String name, email, phone;

        public ApiUser(int id, String name, String email, String phone) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.phone = phone;
        }
    }

    public static class ForgotPasswordResult {
        public String message;
        public String password;


        public ForgotPasswordResult(String message, String password) {
            this.message = message;
            this.password = password;
        }
    }

    public static class ApiOrder {
        public int id;
        public String userEmail;
        public double totalAmount;
        public String status;
        public String createdAt;

        public ApiOrder(int id, String userEmail, double totalAmount, String status, String createdAt) {
            this.id = id;
            this.userEmail = userEmail;
            this.totalAmount = totalAmount;
            this.status = status;
            this.createdAt = createdAt;
        }
    }
}