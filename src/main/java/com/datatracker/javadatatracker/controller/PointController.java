package com.datatracker.javadatatracker.controller;

import com.datatracker.javadatatracker.model.Datapoint;
import com.datatracker.javadatatracker.repository.PointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PointController {
    @Autowired
    PointRepository repository;

    @PostMapping("/api/datapoints")
    public Datapoint addDatapoint(@RequestBody Datapoint datapoint) {
        repository.save(datapoint);
        return datapoint;
    }

    @PutMapping("/api/datapoints/{id}")
    public Datapoint updateDatapoint(@PathVariable Integer id, Datapoint datapoint) {
        Datapoint tempDatapoint = repository.getById(id);

        if(tempDatapoint != null) {
            datapoint.setId(tempDatapoint.getId());
            repository.save(datapoint);
        }
        return datapoint;
    }

    @DeleteMapping("/api/datapoints/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDatapoint(@PathVariable Integer id) {
        repository.deleteById(id);
    }

    @GetMapping("/api/datapoints")
    public List<Datapoint> getAllDatapoints() {
        return repository.findAll();
    }

    @GetMapping("/api/datapoints/{id}")
    public List<Datapoint> getDatapointsBySetId(@PathVariable Integer id) throws Exception {
        return repository.findAllDatapointsByDatasetId(id);
    }


}
