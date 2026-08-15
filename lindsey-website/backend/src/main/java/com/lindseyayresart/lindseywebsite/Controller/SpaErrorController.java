package com.lindseyayresart.lindseywebsite.Controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());
            // If it's a 404, we forward to the Angular SPA index.html
            // However, we should avoid forwarding /api/ requests so they fail properly with 404
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                String uri = (String) request.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);
                if (uri == null) {
                    uri = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
                }

                if (uri != null && !uri.startsWith("/api/")) {
                    return "forward:/index.html";
                }
            }
        }

        // For API errors or non-404 errors, let Spring Boot handle it natively or return empty
        // In a stateless REST API, we shouldn't return HTML for 500s or API 404s, but
        // since we just want to avoid the basic auth popup, returning the error page is fine.
        return "error";
    }
}
