package com.datatracker.javadatatracker.controller;

import com.datatracker.javadatatracker.model.Dataset;
import com.datatracker.javadatatracker.repository.SetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SetController {
    @Autowired
    SetRepository repository;

    @GetMapping("/api/datasets")
    public List<Dataset> getAllDatasets() {
        List<Dataset> datasets = repository.findAll();
        return datasets;
    }

    @GetMapping("/api/datasets/{id}")
    public Dataset getDatasetById(@PathVariable Integer id) {
        Dataset dataset = repository.getById(id);
        return dataset;
    }

    @PostMapping("/api/datasets")
    public Dataset addDataset(Dataset dataset) {
        repository.save(dataset);
        return dataset;
    }

    @PutMapping("/api/datasets/{id}")
    public Dataset updateDataSetById(@PathVariable Integer id, @RequestBody Dataset dataset) {
        Dataset tempDataset = repository.getById(id);

        if(tempDataset != null) {
            dataset.setId(tempDataset.getId());
            dataset.setIncludeDates(tempDataset.getIncludeDates());
            dataset.setUserId(tempDataset.getUserId());
            dataset.setSetType(tempDataset.getSetType());
            dataset.setDatapointList(tempDataset.getDatapointList());
            repository.save(dataset);
        }
        return dataset;
    }

    @DeleteMapping("/api/datasets/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDatasetById(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
