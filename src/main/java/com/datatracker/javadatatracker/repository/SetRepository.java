package com.datatracker.javadatatracker.repository;

import com.datatracker.javadatatracker.model.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SetRepository extends JpaRepository<Dataset, Integer> {
    //Use the userId to find the datasets
    List<Dataset> findAllDatasetsByUserId(Integer userId) throws Exception;
}
