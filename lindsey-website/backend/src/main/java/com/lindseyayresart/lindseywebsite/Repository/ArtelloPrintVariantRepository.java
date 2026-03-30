package com.lindseyayresart.lindseywebsite.Repository;

import com.lindseyayresart.lindseywebsite.Model.ArtelloPrintVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtelloPrintVariantRepository extends JpaRepository<ArtelloPrintVariant, Long> {

    List<ArtelloPrintVariant> findByArtworkIdAndIsAvailableTrueOrderByDisplayOrderAsc(Long artworkId);

    Optional<ArtelloPrintVariant> findByArtelloVariantId(String artelloVariantId);

    @Query("SELECT DISTINCT v.size FROM ArtelloPrintVariant v WHERE v.artwork.id = :artworkId")
    List<String> findDistinctSizesByArtworkId(@Param("artworkId") Long artworkId);

    @Query("SELECT DISTINCT v.frameStyle FROM ArtelloPrintVariant v WHERE v.artwork.id = :artworkId")
    List<String> findDistinctFrameStylesByArtworkId(@Param("artworkId") Long artworkId);

    void deleteByArtworkId(Long artworkId);
}