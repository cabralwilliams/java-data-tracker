package com.datatracker.javadatatracker.controller;

import com.datatracker.javadatatracker.model.User;
import com.datatracker.javadatatracker.repository.PointRepository;
import com.datatracker.javadatatracker.repository.SetRepository;
import com.datatracker.javadatatracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.regex.Pattern;

@Controller
public class HomeController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    SetRepository setRepository;

    @Autowired
    PointRepository pointRepository;

    //Homepage route
    @GetMapping("/")
    public String homepageSetup(Model model, HttpServletRequest request) {
        User sessionUser = new User();

        if(request.getSession(false) != null) {
            sessionUser = (User) request.getSession().getAttribute("SESSION_USER");
            model.addAttribute("loggedIn", sessionUser.isLoggedIn());
        } else {
            model.addAttribute("loggedIn", false);
        }

        return "homepage";
    }

    //Create user route
    @PostMapping("/users")
    public String signUp(@ModelAttribute User user, Model model, HttpServletRequest request) throws Exception {
        //Email regular expression pattern (I think)
        Pattern e_pattern = Pattern.compile("^[a-zA-Z0-9]+[_.-]?[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z0-9]+$");
        if(user.getUsername().equals(null) || user.getUsername().isEmpty() || user.getEmail().equals(null) || !Pattern.matches(String.valueOf(e_pattern), user.getEmail()) || user.getPassword().equals(null) || user.getPassword().isEmpty()) {
            model.addAttribute("notice", "In order to register, the username and password fields must be filled out, and the email provided must be a properly formatted email.");
            return "login";
        }

        try {
            //Encrypt the password
            user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            model.addAttribute("notice", "Username and/or email unavailable.  Please ensure that you haven't registered before, or pick a different username.");
            return "login";
        }

        User sessionUser = userRepository.findUserByUsername(user.getUsername());

        try {
            // If no one is logged in...
            if(sessionUser.equals(null)) {

            }
        } catch (NullPointerException e) {
            model.addAttribute("notice", "User was not recognized.");
            return "login";
        }

        sessionUser.setLoggedIn(true);
        request.getSession().setAttribute("SESSION_USER", sessionUser);
        return "redirect:/dashboard";
    }

    //Log user in route
    @PostMapping("/users/login")
    public String login(@ModelAttribute User user, Model model, HttpServletRequest request) throws Exception {
        if(user.getUsername().equals(null) || user.getUsername().isEmpty() || user.getPassword().equals(null) || user.getPassword().isEmpty()) {
            model.addAttribute("notice", "You must provide a username/email and a password to log in.");
            return "login";
        }

        //Try to find the user by username first
        User sessionUser = userRepository.findUserByUsername(user.getUsername());

        try {
            if(sessionUser.equals(null)) {

            }
        } catch (NullPointerException e1) {
            //If search by username fails, then search by email
            sessionUser = userRepository.findUserByEmail(user.getUsername());
            try {
                if(sessionUser.equals(null)) {

                }
            } catch (NullPointerException e2) {
                model.addAttribute("notice", "Improper login credentials.");
                return "login";
            }
        }

        //Check password
        String sessionUserPassword = sessionUser.getPassword();
        boolean isPasswordValid = BCrypt.checkpw(user.getPassword(), sessionUserPassword);
        if(!isPasswordValid) {
            model.addAttribute("notice","Improper login credentials.");
            return "login";
        }

        sessionUser.setLoggedIn(true);
        request.getSession().setAttribute("SESSION_USER", sessionUser);

        return "redirect:/dashboard";
    }

    //Log user out route
    @GetMapping("/users/logout")
    public String logout(HttpServletRequest request) {
        if(request.getSession(false) != null) {
            request.getSession().invalidate();
        }
        return "redirect:/login";
    }

    //Login page
    @GetMapping("/login")
    public String loginPage(Model model, HttpServletRequest request) {
        if(request.getSession(false) != null) {
            return "redirect:/";
        }
        model.addAttribute("user", new User());
        return "login";
    }
}
