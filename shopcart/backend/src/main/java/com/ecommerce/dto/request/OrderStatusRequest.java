package com.ecommerce.dto.request;

import com.ecommerce.model.enums.OrderStatus;

public class OrderStatusRequest {
    private OrderStatus status;
    private String note;

    public OrderStatusRequest() {}
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}