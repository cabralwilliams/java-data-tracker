package com.datatracker.javadatatracker.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler"})
@Table(name = "dataset")
public class Dataset implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "set_name")
    private String setName;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "set_type")
    private Integer setType;

    @Column(name = "include_dates")
    private Boolean includeDates;

    @OneToMany(mappedBy = "datasetId", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Datapoint> datapointList;

    public Dataset() {
    }

    public Dataset(Integer id, String setName, Integer userId, Integer setType, Boolean includeDates, List<Datapoint> datapointList) {
        this.id = id;
        this.setName = setName;
        this.userId = userId;
        this.setType = setType;
        this.includeDates = includeDates;
        this.datapointList = datapointList;
    }
}
