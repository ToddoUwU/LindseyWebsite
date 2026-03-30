package com.lindseyayresart.lindseywebsite.Services;

import com.lindseyayresart.lindseywebsite.Model.ArtelloPrintVariant;
import com.lindseyayresart.lindseywebsite.Model.ArtelloProductInfo;
import com.lindseyayresart.lindseywebsite.Model.Artwork;
import com.lindseyayresart.lindseywebsite.Model.DTO.ArtelloProductSet;
import com.lindseyayresart.lindseywebsite.Repository.ArtelloPrintVariantRepository;
import com.lindseyayresart.lindseywebsite.Repository.ArtworkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductSetSyncService {

    private final ArtelloService artelloService;
    private final ArtelloPrintVariantRepository variantRepository;
    private final ArtworkRepository artworkRepository;
    private final ShippingRateCalculator shippingCalculator;

    // Self-injection to solve the @Transactional self-invocation issue
    private ProductSetSyncService self;

    private static BigDecimal getFinalRetail(BigDecimal unitCost, BigDecimal shipping) {
        BigDecimal totalCOGS = unitCost.add(shipping);

        // 2. Adjust for Square Fees (approx 3%)
        // If we don't account for the 3% Square takes, it eats into your 60% margin.
        BigDecimal squareAdjustment = new BigDecimal("0.97");
        BigDecimal costAdjustedForFees = totalCOGS.divide(squareAdjustment, 2, RoundingMode.HALF_UP);

        // 3. Apply 40% Margin
        // Formula: Retail = AdjustedCost / (1 - 0.40)
        BigDecimal marginDivisor = new BigDecimal("0.60");
        BigDecimal retail = costAdjustedForFees.divide(marginDivisor, 2, RoundingMode.HALF_UP);

        // round to nearest .05 or .00 6.97-> 7.00, 7.03 -> 7.05
        retail = retail.setScale(2, RoundingMode.HALF_UP);
        return retail;
    }

    @Autowired
    public void setSelf(@Lazy ProductSetSyncService self) {
        this.self = self;
    }

    @Scheduled(cron = "0 0 3 * * *")
    public void syncAllProductSets() {
        log.info("Starting daily Artello sync...");
        artworkRepository.findAll().forEach(art -> {
            try {
                // Call via 'self' to ensure the Transactional proxy is hit
                self.syncProductSet(art.getId());
            } catch (Exception e) {
                log.error("Failed to sync artwork {}: {}", art.getTitle(), e.getMessage());
            }
        });
        log.info("Daily Artello sync complete.");
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncProductSet(Long artworkId) {
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found: " + artworkId));

        // 1. Fetch logic using Optional
        // If we have an ID, use it. If not, try discovery by name.
        Optional<ArtelloProductSet> productSetOpt = (artwork.getArtelloProductSetId() != null)
                ? artelloService.getProductSetById(artwork.getArtelloProductSetId())
                : artelloService.getProductSetByNameLimit1(artwork.getTitle());

        // 2. Process the Optional result
        productSetOpt.ifPresentOrElse(
                productSet -> {
                    // If we discovered a new ID, save it to the Artwork entity
                    if (artwork.getArtelloProductSetId() == null) {
                        log.info("Discovered new ID for '{}': {}", artwork.getTitle(), productSet.getId());
                        artwork.setArtelloProductSetId(productSet.getId());
                        artworkRepository.save(artwork);
                    }

                    performVariantSync(artwork, productSet);
                },
                () -> log.warn("No matching Artello ProductSet found for: {}", artwork.getTitle())
        );
    }

    private void performVariantSync(Artwork artwork, ArtelloProductSet productSet) {
        // Upsert variants and get IDs of what is currently active on Artello
        Set<String> activeIds = productSet.getProducts().stream()
                .map(info -> syncVariant(info, artwork))
                .map(ArtelloPrintVariant::getArtelloVariantId)
                .collect(Collectors.toSet());

        // Mark any local variants NOT in the Artello response as unavailable
        variantRepository.findByArtworkIdAndIsAvailableTrueOrderByDisplayOrderAsc(artwork.getId())
                .stream()
                .filter(v -> !activeIds.contains(v.getArtelloVariantId()))
                .forEach(v -> {
                    v.setIsAvailable(false);
                    variantRepository.save(v);
                    log.info("Marked variant {} as unavailable (removed from Artello)", v.getArtelloVariantId());
                });
    }

    private ArtelloPrintVariant syncVariant(ArtelloProductInfo info, Artwork artwork) {
        // 1. Total Base Cost (Production + Shipping)
        BigDecimal unitCost = info.getUnitCost();
        BigDecimal shipping = shippingCalculator.calculateShippingEstimate(
                info.getSize(), info.getFrameStyle(), info.isFramed());

        BigDecimal retail = getFinalRetail(unitCost, shipping);

        ArtelloPrintVariant variant = variantRepository.findByArtelloVariantId(info.getId())
                .orElseGet(() -> ArtelloPrintVariant.builder()
                        .artwork(artwork)
                        .artelloVariantId(info.getId())
                        .build());

        variant.setRetailPrice(retail);
        variant.setIsAvailable(true);
        variant.setSize(info.getSize());
        variant.setFrameStyle(info.getFrameStyle());

        return variantRepository.save(variant);
    }
}