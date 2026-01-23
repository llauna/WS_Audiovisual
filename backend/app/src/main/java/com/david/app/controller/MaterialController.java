
package com.david.app.controller;

import com.david.app.model.Material;
import com.david.app.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materiales")
@CrossOrigin(origins = "http://localhost:4200")
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    @GetMapping
    public List<Material> getAllMateriales() {
        return materialRepository.findAll();
    }

    @PostMapping
    public Material saveMaterial(@RequestBody Material material) {
        return materialRepository.save(material);
    }

    @DeleteMapping("/{id}")
    public void deleteMaterial(@PathVariable String id) {
        materialRepository.deleteById(id);
    }
}