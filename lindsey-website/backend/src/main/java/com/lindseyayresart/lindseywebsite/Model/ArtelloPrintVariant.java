package com.lindseyayresart.lindseywebsite.Model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ARTELLO_PRINT_VARIANTS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtelloPrintVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;

    @Column(name = "artello_variant_id", nullable = false, unique = true, length = 36)
    private String artelloVariantId;

    @Column(name = "catalog_product_id", nullable = false, length = 50)
    private String catalogProductId;

    @Column(nullable = false, length = 20)
    private String size;

    @Column(nullable = false, length = 20)
    private String orientation;

    @Column(name = "paper_type", nullable = false, length = 50)
    private String paperType;

    @Column(name = "paper_style", nullable = false, length = 50)
    private String paperStyle;

    @Column(name = "frame_style", nullable = false, length = 50)
    private String frameStyle;

    @Column(name = "frame_color", nullable = false, length = 50)
    private String frameColor;

    @Builder.Default
    @Column(name = "include_framing_service", nullable = false)
    private Boolean includeFramingService = false;

    @Builder.Default
    @Column(name = "include_hanging_pins", nullable = false)
    private Boolean includeHangingPins = false;

    @Builder.Default
    @Column(name = "include_mats", nullable = false)
    private Boolean includeMats = false;

    @Column(name = "unit_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Column(name = "shipping_estimate", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingEstimate;

    @Column(name = "retail_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal retailPrice;

    @Builder.Default
    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Builder.Default
    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}