package com.lindseyayresart.lindseywebsite.Model.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lindseyayresart.lindseywebsite.Model.ArtelloProductInfo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArtelloProductSet {
    private String name;
    private String id;
    private String createdAt;
    private String updatedAt;
    private List<ArtelloProductInfo> products;
}
