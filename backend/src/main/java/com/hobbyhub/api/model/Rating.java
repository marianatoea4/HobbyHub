package com.hobbyhub.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ratings")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "evaluator_id")
    private User evaluator;

    @ManyToOne
    @JoinColumn(name = "target_user_id")
    private User targetUser;

    @ManyToOne
    @JoinColumn(name = "target_event_id")
    private Event targetEvent;

    @Column(nullable = false)
    private Integer score;

    private String comment;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getEvaluator() { return evaluator; }
    public void setEvaluator(User evaluator) { this.evaluator = evaluator; }

    public User getTargetUser() { return targetUser; }
    public void setTargetUser(User targetUser) { this.targetUser = targetUser; }

    public Event getTargetEvent() { return targetEvent; }
    public void setTargetEvent(Event targetEvent) { this.targetEvent = targetEvent; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
