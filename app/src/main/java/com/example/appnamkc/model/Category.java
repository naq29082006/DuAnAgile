package com.example.appnamkc.model;

public class Category {
    private int id;
    private String name;
    private int isDeleted;

    public Category(int id, String name, int isDeleted) {
        this.id = id;
        this.name = name;
        this.isDeleted = isDeleted;
    }

    public int getId() { return id; }
    public String getName() { return name; }
}
