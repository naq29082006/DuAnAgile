package com.example.appnamkc.db;

import android.content.*;
import android.database.Cursor;
import android.database.sqlite.*;

import com.example.appnamkc.model.Category;

import java.util.ArrayList;

public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DB_NAME = "category.db";
    private static final int DB_VERSION = 1;

    public DatabaseHelper(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE category (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "name TEXT," +
                "is_deleted INTEGER DEFAULT 0)");

        db.execSQL("INSERT INTO category(name) VALUES" +
                "('Điện thoại'),('Laptop'),('Phụ kiện'),('Đồng hồ')");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {}

    // Lấy danh mục chưa bị xóa
    public ArrayList<Category> getCategories(String keyword, String sort) {
        ArrayList<Category> list = new ArrayList<>();
        SQLiteDatabase db = getReadableDatabase();

        String sql = "SELECT * FROM category " +
                "WHERE is_deleted=0 AND name LIKE ? " +
                "ORDER BY name " + sort;

        Cursor c = db.rawQuery(sql, new String[]{"%" + keyword + "%"});

        while (c.moveToNext()) {
            list.add(new Category(
                    c.getInt(0),
                    c.getString(1),
                    c.getInt(2)
            ));
        }
        c.close();
        return list;
    }

    // Xóa mềm
    public void deleteCategory(int id) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("is_deleted", 1);
        db.update("category", cv, "id=?", new String[]{String.valueOf(id)});
    }
}
