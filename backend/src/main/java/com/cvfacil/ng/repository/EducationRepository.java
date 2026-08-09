package com.cvfacil.ng.repository;

import com.cvfacil.ng.model.Education;
import com.cvfacil.ng.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByResume(Resume resume);
}
