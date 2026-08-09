package com.cvfacil.ng.repository;

import com.cvfacil.ng.model.Resume;
import com.cvfacil.ng.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cvfacil.ng.repository.projection.ResumeSummary;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUser(User user);
    List<ResumeSummary> findAllSummariesByUser(User user);
    List<Resume> findByUserAndDeletedAtIsNull(User user);
    List<Resume> findAllByDeletedAtIsNull();

    @Query(value = "SELECT * FROM cv_resumes r WHERE r.user_id = :#{#user.id} AND r.deleted_at IS NOT NULL", nativeQuery = true)
    List<Resume> findByUserAndDeletedAtIsNotNull(User user);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT r FROM Resume r WHERE r.id = :id")
    Optional<Resume> findByIdWithOwner(Long id);

    @EntityGraph(attributePaths = {"user", "experiences", "educations", "skills", "languages", "hobbies"})
    @Query("SELECT r FROM Resume r WHERE r.id = :id")
    Optional<Resume> findByIdFull(Long id);
}
