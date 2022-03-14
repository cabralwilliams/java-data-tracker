package com.datatracker.javadatatracker.controller;

import com.datatracker.javadatatracker.model.Datapoint;
import com.datatracker.javadatatracker.model.Dataset;
import com.datatracker.javadatatracker.model.User;
import com.datatracker.javadatatracker.repository.PointRepository;
import com.datatracker.javadatatracker.repository.SetRepository;
import com.datatracker.javadatatracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

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
        Dataset dataset = setRepository.getById(id);
        Integer datasetId = dataset.getId();
        List<Datapoint> datapoints = pointRepository.findAllDatapointsByDatasetId(datasetId);
        //Need to get the userId of the dataset so that we can determine whether the user has edit rights
        Integer dUserId = dataset.getUserId();
        User sessionUser = new User();
        if(request.getSession(false) != null) {
            sessionUser = (User) request.getSession().getAttribute("SESSION_USER");
            Integer userId = sessionUser.getId();
            if(dUserId.equals(userId)) {
                model.addAttribute("canEdit", true);
            } else {
                model.addAttribute("canEdit", false);
            }
            model.addAttribute("loggedIn", sessionUser.isLoggedIn());
        } else {
            model.addAttribute("canEdit", false);
            model.addAttribute("loggedIn", false);
        }
        model.addAttribute("dataset", dataset);
        model.addAttribute("datapoints", datapoints);
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
    public String datasetsPageSetup(Model model, HttpServletRequest request) {
        User sessionUser = (User) request.getSession().getAttribute("SESSION_USER");

        if(sessionUser != null) {
            //A user is logged in
            model.addAttribute("loggedIn", sessionUser.isLoggedIn());
        } else {
            model.addAttribute("loggedIn", false);
        }
        List<Dataset> datasets = setRepository.findAll();
        model.addAttribute("datasets", datasets);
        return "datasets";
    }
}
