package com.datatracker.javadatatracker.repository;

import com.datatracker.javadatatracker.model.Datapoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointRepository extends JpaRepository<Datapoint, Integer> {
    //Find all the datapoints associated with a particular dataset by the dataset id
    List<Datapoint> findAllDatapointsByDatasetId(Integer datasetId) throws Exception;
}
