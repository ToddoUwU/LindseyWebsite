package com.lindseyayresart.lindseywebsite.Interfaces;

import com.lindseyayresart.lindseywebsite.Model.DTO.FulfillmentRequest;
import com.lindseyayresart.lindseywebsite.Model.DTO.FulfillmentStatus;

public interface FulfillmentProvider {
    String submitOrder(FulfillmentRequest request);
    FulfillmentStatus getOrderStatus(String providerOrderId);
    void cancelOrder(String providerOrderId);
    boolean testConnection();
    String getProviderName();
}
