package com.david.app.controller;

import com.david.app.model.Categoria;
import com.david.app.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    @PostMapping
    public Categoria saveCategoria(@RequestBody Categoria categoria) {
        Categoria normalized = normalize(categoria);
        if (categoriaRepository.existsByNombre(normalized.getNombre())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una categoria con ese nombre");
        }
        return categoriaRepository.save(normalized);
    }

    @PutMapping("/{id}")
    public Categoria updateCategoria(@PathVariable String id, @RequestBody Categoria categoria) {
        Categoria normalized = normalize(categoria);
        if (categoriaRepository.existsByNombreAndIdNot(normalized.getNombre(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una categoria con ese nombre");
        }
        normalized.setId(id);
        return categoriaRepository.save(normalized);
    }

    @DeleteMapping("/{id}")
    public void deleteCategoria(@PathVariable String id) {
        categoriaRepository.deleteById(id);
    }

    private Categoria normalize(Categoria categoria) {
        if (categoria.getNombre() == null || categoria.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        categoria.setNombre(categoria.getNombre().trim());
        if (categoria.getDescripcion() == null) {
            categoria.setDescripcion("");
        }
        return categoria;
    }
}
