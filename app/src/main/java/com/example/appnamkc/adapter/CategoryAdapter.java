package com.example.appnamkc.adapter;

import android.content.Context;
import android.view.*;
import android.widget.*;

import com.example.appnamkc.R;
import com.example.appnamkc.db.DatabaseHelper;
import com.example.appnamkc.model.Category;

import java.util.ArrayList;

public class CategoryAdapter extends BaseAdapter {

    Context context;
    ArrayList<Category> list;
    DatabaseHelper db;

    public CategoryAdapter(Context context, ArrayList<Category> list) {
        this.context = context;
        this.list = list;
        db = new DatabaseHelper(context);
    }

    @Override public int getCount() { return list.size(); }
    @Override public Object getItem(int i) { return list.get(i); }
    @Override public long getItemId(int i) { return i; }

    @Override
    public View getView(int i, View view, ViewGroup parent) {
        if (view == null)
            view = LayoutInflater.from(context)
                    .inflate(R.layout.item_category, parent, false);

        TextView tvName = view.findViewById(R.id.tvName);
        ImageButton btnEdit = view.findViewById(R.id.btnEdit);
        ImageButton btnDelete = view.findViewById(R.id.btnDelete);

        Category c = list.get(i);
        tvName.setText(c.getName());

        // SỬA (UI only)
        btnEdit.setOnClickListener(v ->
                Toast.makeText(context,
                        "Sửa: " + c.getName(),
                        Toast.LENGTH_SHORT).show()
        );

        // XÓA MỀM
        btnDelete.setOnClickListener(v -> {
            db.deleteCategory(c.getId());
            list.remove(i);
            notifyDataSetChanged();
            Toast.makeText(context,
                    "Đã đưa vào thùng rác",
                    Toast.LENGTH_SHORT).show();
        });

        return view;
    }
}
