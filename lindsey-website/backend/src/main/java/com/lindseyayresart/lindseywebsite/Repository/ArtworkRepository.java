package com.lindseyayresart.lindseywebsite.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lindseyayresart.lindseywebsite.Model.Artwork;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    // Standard JPA methods - no SQL needed
    List<Artwork> findByForSale(Boolean forSale);

    // Custom query using the stored procedure
    @Query(value = "SELECT * FROM get_artworks_by_medium(:medium)", nativeQuery = true)
    List<Artwork> findArtworksByMedium(String medium);
}