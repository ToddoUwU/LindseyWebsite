package com.lindseyayresart.lindseywebsite.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lindseyayresart.lindseywebsite.Model.Artwork;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    // Just basic JPA methods - all custom queries will be in stored procedures
    List<Artwork> findByForSale(Boolean forSale);
    List<Artwork> findByTitle(String title);
}