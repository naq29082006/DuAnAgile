package com.example.appnamkc.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.example.appnamkc.R;
import com.example.appnamkc.api.ApiClient;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Locale;

public class OrderAdapter extends BaseAdapter {

    private final Context context;
    private ArrayList<ApiClient.ApiOrder> orders;

    public OrderAdapter(Context context, ArrayList<ApiClient.ApiOrder> orders) {
        this.context = context;
        this.orders = orders;
    }

    @Override
    public int getCount() {
        return orders.size();
    }

    @Override
    public Object getItem(int position) {
        return orders.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.item_order, parent, false);
        }

        TextView tvOrderId = convertView.findViewById(R.id.tvOrderId);
        TextView tvOrderStatus = convertView.findViewById(R.id.tvOrderStatus);
        TextView tvOrderTotal = convertView.findViewById(R.id.tvOrderTotal);
        TextView tvOrderDate = convertView.findViewById(R.id.tvOrderDate);

        ApiClient.ApiOrder order = orders.get(position);

        tvOrderId.setText("#" + order.id);
        tvOrderStatus.setText("Trạng thái: " + order.status);

        NumberFormat formatter = NumberFormat.getNumberInstance(new Locale("vi", "VN"));
        tvOrderTotal.setText("Tổng: " + formatter.format(order.totalAmount) + " VNĐ");

        tvOrderDate.setText("Ngày tạo: " + order.createdAt);

        return convertView;
    }

    public void updateData(ArrayList<ApiClient.ApiOrder> newOrders) {
        this.orders = newOrders;
        notifyDataSetChanged();
    }
}

