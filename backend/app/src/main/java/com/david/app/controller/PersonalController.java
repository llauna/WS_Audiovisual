package com.david.app.controller;

import com.david.app.model.Personal;
import com.david.app.repository.PersonalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(origins = "http://localhost:4200")
public class PersonalController {

    @Autowired
    private PersonalRepository personalRepository;

    @GetMapping
    public List<Personal> getAllPersonal() {
        return personalRepository.findAll();
    }

    @PostMapping
    public Personal savePersonal(@RequestBody Personal personal) {
        System.out.println("Personal recibido: " + personal);
        return personalRepository.save(personal);
    }

    @DeleteMapping("/{id}")
    public void deletePersonal(@PathVariable String id) {
        personalRepository.deleteById(id);
    }
}