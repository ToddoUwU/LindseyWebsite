package com.lindseyayresart.lindseywebsite.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArtelloBranding {
    private String insertId;
    private String stickerId;
    private String insertPlacement;
    private String stickerPlacement;
}
