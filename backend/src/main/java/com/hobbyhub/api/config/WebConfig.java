package com.hobbyhub.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // numele folderului unde se salveaza imaginile, relativ la radacina proiectului
    private static final String UPLOAD_DIR = "uploads";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get(UPLOAD_DIR).toFile().getAbsolutePath();

        String normalizedPath = uploadPath.replace("\\", "/");

        registry.addResourceHandler("/" + UPLOAD_DIR + "/**")
                .addResourceLocations("file:///" + normalizedPath + "/");
    }
}