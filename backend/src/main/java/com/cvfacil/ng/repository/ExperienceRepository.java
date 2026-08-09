package com.cvfacil.ng.repository;

import com.cvfacil.ng.model.Experience;
import com.cvfacil.ng.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByResume(Resume resume);
}
