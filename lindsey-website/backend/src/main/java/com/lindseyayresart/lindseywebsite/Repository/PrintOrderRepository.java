package com.lindseyayresart.lindseywebsite.Repository;

import com.lindseyayresart.lindseywebsite.Enums.OrderStatus;
import com.lindseyayresart.lindseywebsite.Model.PrintOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrintOrderRepository extends JpaRepository<PrintOrder, Long> {

    Optional<PrintOrder> findByOrderReference(String orderReference);

    Optional<PrintOrder> findBySquarePaymentId(String squarePaymentId);

    Optional<PrintOrder> findByArtelloOrderId(String artelloOrderId);

    List<PrintOrder> findByStatusOrderByCreatedAtDesc(OrderStatus status);
}
