package com.datatracker.javadatatracker.controller;

import com.datatracker.javadatatracker.model.Dataset;
import com.datatracker.javadatatracker.model.User;
import com.datatracker.javadatatracker.repository.PointRepository;
import com.datatracker.javadatatracker.repository.SetRepository;
import com.datatracker.javadatatracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
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
        List<Dataset> datasets = setRepository.findAllDatasetsByUserId(userId);
        model.addAttribute("user", sessionUser);
        model.addAttribute("datasets", datasets);
        model.addAttribute("loggedIn", sessionUser.isLoggedIn());
        return "redirect:/dashboard";
    }
}
