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
public class ArtelloCustomerAddress {
    private String city;
    private String country;
    private String email;
    private String company;
    private String name;
    private String state;
    private String street1;
    private String zipcode;
}
