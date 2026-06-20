package com.lindseyayresart.lindseywebsite.Config;

import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@Configuration
public class SpaErrorViewConfig {

    @Bean
    public ErrorViewResolver customErrorViewResolver() {
        return (HttpServletRequest request, HttpStatus status, Map<String, Object> model) -> {
            if (status == HttpStatus.NOT_FOUND) {
                String accept = request.getHeader("Accept");
                if (accept != null && accept.contains("text/html")) {
                    return new ModelAndView("forward:/index.html");
                }
            }
            return null; // Let Spring handle other errors
        };
    }
}
