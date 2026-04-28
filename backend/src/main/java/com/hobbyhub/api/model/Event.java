package com.hobbyhub.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "organizer_id") // Numele coloanei din tabelul SQL
    private User organizer;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT") // Pentru descrieri mai lungi
    private String description;

    @Column(nullable = false)
    private String category;

    private LocalDateTime dateTime;
    private Integer capacity;

    private Double lat;
    private Double lng;

    private String status;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventImage> images = new ArrayList<>();

    public Long getId() { return id; }

    public List<EventImage> getImages() { return images; }

    public void setImages(List<EventImage> images) { this.images = images; }

    public void setId(Long id) { this.id = id; }

    public User getOrganizer() { return organizer; }
    public void setOrganizer(User organizer) { this.organizer = organizer; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @JsonProperty("organizerId")
    public void setOrganizerById(Long userId) {
        if (userId != null) {
            this.organizer = new User();
            this.organizer.setId(userId);
        }
    }
}
