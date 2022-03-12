package com.datatracker.javadatatracker.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "datapoint")
public class Datapoint implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "dataset_id")
    private Integer datasetId;

    @Column(name = "value_one")
    private Double valueOne;

    @Column(name = "value_two")
    private Double valueTwo;

    @Column(name = "data_date")
    private Date dataDate;

    public Datapoint() {

    }

    public Datapoint(Integer id, Integer datasetId, Double valueOne, Double valueTwo, Date dataDate) {
        this.id = id;
        this.datasetId = datasetId;
        this.valueOne = valueOne;
        this.valueTwo = valueTwo;
        this.dataDate = dataDate;
    }
}
