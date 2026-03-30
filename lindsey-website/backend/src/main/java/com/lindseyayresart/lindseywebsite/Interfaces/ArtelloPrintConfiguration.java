package com.lindseyayresart.lindseywebsite.Interfaces;

import com.lindseyayresart.lindseywebsite.Model.ArtelloDesign;

import java.util.List;

public interface ArtelloPrintConfiguration {
    String getCatalogProductId();

    String getFrameColor();

    String getFrameStyle();

    String getOrientation();

    String getPaperStyle();

    String getPaperType();

    String getSize();

    List<ArtelloDesign> getDesigns();
}
