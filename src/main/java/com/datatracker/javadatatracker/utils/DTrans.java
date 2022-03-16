package com.datatracker.javadatatracker.utils;

import com.datatracker.javadatatracker.model.Datapoint;

import java.util.List;

public class DTrans {
    public DTrans() {

    }

    public double getAverageDataValueUnivariate(List<Datapoint> datapoints) {
        if(datapoints.size() == 0) {
            return 0.0;
        }
        double sum = 0.0;
        for(Datapoint d : datapoints) {
            sum += d.getValueOne();
        }
        return sum/datapoints.size();
    }

    public double[] getAverageDataValuesBivariate(List<Datapoint> datapoints) {
        if(datapoints.size() == 0) {
            return new double[] {0.0,0.0};
        }
        double sum1 = 0.0;
        double sum2 = 0.0;
        for(Datapoint d : datapoints) {
            sum1 += d.getValueOne();
            sum2 += d.getValueTwo();
        }
        return new double[] {sum1/datapoints.size(), sum2/datapoints.size()};
    }

    public double getSumOfSquaresUnivariate(List<Datapoint> datapoints) {
        if(datapoints.size() == 0) {
            return 0.0;
        }
        double average = getAverageDataValueUnivariate(datapoints);
        double differenceSum = 0.0;
        for(Datapoint d : datapoints) {
            differenceSum += (d.getValueOne() - average)*(d.getValueOne() - average);
        }
        return differenceSum;
    }

    public double[] getSumOfSquaresBivariate(List<Datapoint> datapoints) {
        if(datapoints.size() == 0) {
            return new double[] {0.0,0.0};
        }
        double[] averages = getAverageDataValuesBivariate(datapoints);
        double differenceSum1 = 0.0;
        double differenceSum2 = 0.0;
        for(Datapoint d : datapoints) {
            differenceSum1 += (d.getValueOne() - averages[0])*(d.getValueOne() - averages[0]);
            differenceSum2 += (d.getValueTwo() - averages[1])*(d.getValueTwo() - averages[1]);
        }
        return new double[] {differenceSum1, differenceSum2};
    }

    public double[] getUnivariateVariances(List<Datapoint> datapoints) {
        if(datapoints.size() == 0 || datapoints.size() == 1) {
            return new double[] {0.0,0.0};
        }
        double sumOfSquares = getSumOfSquaresUnivariate(datapoints);
        return new double[] {sumOfSquares/(datapoints.size() - 1), sumOfSquares/datapoints.size()};
    }

    public double getSumOfCoSquares(List<Datapoint> datapoints) {
        if(datapoints.size() == 0 || datapoints.size() == 1) {
            return 0.0;
        }
        double covariance = 0.0;
        double[] averages = getAverageDataValuesBivariate(datapoints);
        for(Datapoint d : datapoints) {
            covariance += (d.getValueOne() - averages[0])*(d.getValueTwo() - averages[1]);
        }
        return covariance;
    }

    public double getCorrelation(List<Datapoint> datapoints) {
        if(datapoints.size() == 0 || datapoints.size() == 1) {
            return 0.0;
        }
        double[] averages = getAverageDataValuesBivariate(datapoints);
        double sumOfSquaresX = 0.0;
        double sumOfSquaresY = 0.0;
        for(Datapoint d : datapoints) {
            sumOfSquaresX += (d.getValueOne() - averages[0])*(d.getValueOne() - averages[0]);
            sumOfSquaresY += (d.getValueTwo() - averages[1])*(d.getValueTwo() - averages[1]);
        }
        return getSumOfCoSquares(datapoints)/(Math.sqrt(sumOfSquaresX)*Math.sqrt(sumOfSquaresY));
    }
}
