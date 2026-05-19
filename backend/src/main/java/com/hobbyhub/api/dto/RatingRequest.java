package com.hobbyhub.api.dto;

public class RatingRequest {
    private Long targetUserId;
    private Long targetEventId;
    private Integer score;
    private String comment;

    public Long getTargetUserId() { return targetUserId; }
    public void setTargetUserId(Long targetUserId) { this.targetUserId = targetUserId; }

    public Long getTargetEventId() { return targetEventId; }
    public void setTargetEventId(Long targetEventId) { this.targetEventId = targetEventId; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
