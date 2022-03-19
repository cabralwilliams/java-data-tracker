package com.datatracker.javadatatracker.controller;

import com.datatracker.javadatatracker.model.Datapoint;
import com.datatracker.javadatatracker.model.Dataset;
import com.datatracker.javadatatracker.model.User;
import com.datatracker.javadatatracker.repository.PointRepository;
import com.datatracker.javadatatracker.repository.SetRepository;
import com.datatracker.javadatatracker.repository.UserRepository;
import com.datatracker.javadatatracker.utils.DTrans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Controller
public class DatatrackerController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    SetRepository setRepository;

    @Autowired
    PointRepository pointRepository;

    @GetMapping("/dashboard")
    public String dashboardPageSetup(Model model, HttpServletRequest request) throws Exception {
        if(request.getSession(false) != null) {
            setupDashboardPage(model, request);
            return "dashboard";
        } else {
            model.addAttribute("user", new User());
            return "login";
        }
    }

    public Model setupDashboardPage(Model model, HttpServletRequest request) throws Exception {
        User sessionUser = (User) request.getSession().getAttribute("SESSION_USER");

        Integer userId = sessionUser.getId();
        List<Dataset> datasets = setRepository.findAllDatasetsByUserId(userId);
        model.addAttribute("user", sessionUser);
        model.addAttribute("datasets", datasets);
        model.addAttribute("loggedIn", sessionUser.isLoggedIn());
        return model;
    }

    @PostMapping("/datasets")
    public String addDataset(@RequestBody Dataset dataset, Model model, HttpServletRequest request) throws Exception {
        User sessionUser = (User) request.getSession().getAttribute("SESSION_USER");
        setRepository.save(dataset);
        Integer userId = sessionUser.getId();
        //Need to get the updated list of datasets for this user
        List<Dataset> datasets = setRepository.findAllDatasetsByUserId(userId);
        model.addAttribute("user", sessionUser);
        model.addAttribute("datasets", datasets);
        model.addAttribute("loggedIn", sessionUser.isLoggedIn());
        return "redirect:/dashboard";
    }

    @GetMapping("/datasets/{id}")
    public String datasetPageSetup(@PathVariable Integer id, Model model, HttpServletRequest request) throws Exception {
        Dataset dataset = new Dataset();
        User sessionUser = (User) request.getSession().getAttribute("SESSION_USER");
        try {
            dataset = setRepository.getById(id);
            if(dataset.getPublicity() == 0 && !Objects.equals(dataset.getUserId(), sessionUser.getId())) {
                System.out.println(dataset.getUserId());
                System.out.println(sessionUser.getId());
                return "not-found";
            }
        } catch (EntityNotFoundException e) {
            return "not-found";
        }

        Integer datasetId = dataset.getId();
        List<Datapoint> datapoints = pointRepository.findAllDatapointsByDatasetId(datasetId);
        //Need to get the userId of the dataset so that we can determine whether the user has edit rights
        Integer dUserId = dataset.getUserId();

        if(sessionUser != null) {
            sessionUser = (User) request.getSession().getAttribute("SESSION_USER");
            Integer userId = sessionUser.getId();
            if(dUserId.equals(userId)) {
                model.addAttribute("canEdit", true);
            } else {
                model.addAttribute("canEdit", false);
                if(dataset.getPublicity() == 0) {
                    model.addAttribute("loggedIn", sessionUser.isLoggedIn());
                    return "not-found";
                }
            }
            model.addAttribute("loggedIn", sessionUser.isLoggedIn());
        } else {
            model.addAttribute("canEdit", false);
            model.addAttribute("loggedIn", false);
        }
        boolean isBivaraiate = dataset.getSetType() == 1;
        DTrans dTrans = new DTrans();
        model.addAttribute("dataset", dataset);
        model.addAttribute("datapoints", datapoints);
        model.addAttribute("includeDates", dataset.getIncludeDates());
        model.addAttribute("isBivariate", isBivaraiate);
        if(datapoints.size() > 0) {
            model.addAttribute("containsData", true);
            if(isBivaraiate) {
                double[] setAverages = dTrans.getAverageDataValuesBivariate(datapoints);
                double[] setSumOfSquares = dTrans.getSumOfSquaresBivariate(datapoints);
                double setCoSums = dTrans.getSumOfCoSquares(datapoints);
                double correlation = dTrans.getCorrelation(datapoints);
                double slopeCo = correlation*Math.sqrt(setSumOfSquares[1])/Math.sqrt(setSumOfSquares[0]);
                double intCo = setAverages[1] - slopeCo*setAverages[0];
                model.addAttribute("setAverages", setAverages);
                model.addAttribute("setSumOfSquares", setSumOfSquares);
                model.addAttribute("correlationCoefficient", correlation);
                model.addAttribute("slopeCo", slopeCo);
                model.addAttribute("intCo", intCo);
            } else {
                double setAverage = dTrans.getAverageDataValueUnivariate(datapoints);
                double setSumOfSquares = dTrans.getSumOfSquaresUnivariate(datapoints);
                double[] setVariances = dTrans.getUnivariateVariances(datapoints);
                model.addAttribute("setAverage", setAverage);
                model.addAttribute("setSumOfSquares", setSumOfSquares);
                model.addAttribute("setVariances", setVariances);
                double[] setStandardDeviations = new double[] { Math.sqrt(setVariances[0]), Math.sqrt(setVariances[1])};
                model.addAttribute("setStandardDeviations", setStandardDeviations);
            }
        } else {
            model.addAttribute("containsData", false);
        }
        return "single-dataset";
    }

    @GetMapping("/create")
    public String createPageSetup(Model model, HttpServletRequest request) {
        if(request.getSession(false) != null) {
            User sessionUser = (User) request.getSession().getAttribute("SESSION_USER");
            model.addAttribute("loggedIn", sessionUser.isLoggedIn());
            model.addAttribute("dataset", new Dataset());
            model.addAttribute("user", sessionUser);
            return "create";
        } else {
            model.addAttribute("loggedIn", false);
            return "redirect:/login";
        }
    }

    @GetMapping("/datasets")
    public String datasetsPageSetup(Model model, HttpServletRequest request) throws Exception {
        User sessionUser = (User) request.getSession().getAttribute("SESSION_USER");
        List<Dataset> userSets = new List<Dataset>() {
            @Override
            public int size() {
                return 0;
            }

            @Override
            public boolean isEmpty() {
                return false;
            }

            @Override
            public boolean contains(Object o) {
                return false;
            }

            @Override
            public Iterator<Dataset> iterator() {
                return null;
            }

            @Override
            public Object[] toArray() {
                return new Object[0];
            }

            @Override
            public <T> T[] toArray(T[] a) {
                return null;
            }

            @Override
            public boolean add(Dataset dataset) {
                return false;
            }

            @Override
            public boolean remove(Object o) {
                return false;
            }

            @Override
            public boolean containsAll(Collection<?> c) {
                return false;
            }

            @Override
            public boolean addAll(Collection<? extends Dataset> c) {
                return false;
            }

            @Override
            public boolean addAll(int index, Collection<? extends Dataset> c) {
                return false;
            }

            @Override
            public boolean removeAll(Collection<?> c) {
                return false;
            }

            @Override
            public boolean retainAll(Collection<?> c) {
                return false;
            }

            @Override
            public void clear() {

            }

            @Override
            public Dataset get(int index) {
                return null;
            }

            @Override
            public Dataset set(int index, Dataset element) {
                return null;
            }

            @Override
            public void add(int index, Dataset element) {

            }

            @Override
            public Dataset remove(int index) {
                return null;
            }

            @Override
            public int indexOf(Object o) {
                return 0;
            }

            @Override
            public int lastIndexOf(Object o) {
                return 0;
            }

            @Override
            public ListIterator<Dataset> listIterator() {
                return null;
            }

            @Override
            public ListIterator<Dataset> listIterator(int index) {
                return null;
            }

            @Override
            public List<Dataset> subList(int fromIndex, int toIndex) {
                return null;
            }
        };

        if(sessionUser != null) {
            //A user is logged in
            model.addAttribute("loggedIn", sessionUser.isLoggedIn());
            userSets = sessionUser.getDatasetList();
            if(userSets.size() > 0) {
                System.out.println(userSets.size());
                model.addAttribute("userHasSets", true);
                model.addAttribute("userSets", userSets);
            }
        } else {
            model.addAttribute("loggedIn", false);
            model.addAttribute("userHasSets", false);
        }
//        List<Dataset> datasets = setRepository.findAll();
        List<Dataset> datasets = setRepository.findAllDatasetsByPublicity(1);
        model.addAttribute("datasets", datasets);
        return "datasets";
    }
}
