package com.datatracker.javadatatracker.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

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

    //This will give the user the option to store dates for the dataset - just in case the user wants to track against time
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Dataset dataset = (Dataset) o;
        return Objects.equals(id, dataset.id) && Objects.equals(setName, dataset.setName) && Objects.equals(userId, dataset.userId) && Objects.equals(setType, dataset.setType) && Objects.equals(includeDates, dataset.includeDates) && Objects.equals(datapointList, dataset.datapointList);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, setName, userId, setType, includeDates, datapointList);
    }

    @Override
    public String toString() {
        return "Dataset{" +
                "id=" + id +
                ", setName='" + setName + '\'' +
                ", userId=" + userId +
                ", setType=" + setType +
                ", includeDates=" + includeDates +
                ", datapointList=" + datapointList +
                '}';
    }
}
