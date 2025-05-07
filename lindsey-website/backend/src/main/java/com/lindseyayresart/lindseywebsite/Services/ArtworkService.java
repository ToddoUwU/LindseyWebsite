package com.lindseyayresart.lindseywebsite.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lindseyayresart.lindseywebsite.Model.Artwork;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;

@Service
public class ArtworkService {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    public List<Artwork> getArtworksByMedium(String medium) {
        StoredProcedureQuery query = entityManager
            .createStoredProcedureQuery("get_artworks_by_medium", Artwork.class)
            .registerStoredProcedureParameter("p_medium", String.class, ParameterMode.IN)
            .setParameter("p_medium", medium);
        
        return query.getResultList();
    }
}