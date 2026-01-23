package com.david.app.controller;

import com.david.app.model.Almacen;
import com.david.app.repository.AlmacenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/almacenes")
@CrossOrigin(origins = "http://localhost:4200")
public class AlmacenController {

    @Autowired
    private AlmacenRepository almacenRepository;

    @GetMapping
    public List<Almacen> getAll() {
        return almacenRepository.findAll();
    }

    @PostMapping
    public Almacen create(@RequestBody Almacen almacen) {
        if (almacen.getNombre() == null || almacen.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        String nombre = almacen.getNombre().trim();
        if (almacenRepository.existsByNombre(nombre)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un almacen con ese nombre");
        }
        almacen.setNombre(nombre);
        return almacenRepository.save(almacen);
    }

    @PutMapping("/{id}")
    public Almacen update(@PathVariable String id, @RequestBody Almacen almacen) {
        if (almacen.getNombre() == null || almacen.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        String nombre = almacen.getNombre().trim();
        if (almacenRepository.existsByNombreAndIdNot(nombre, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un almacen con ese nombre");
        }
        almacen.setId(id);
        almacen.setNombre(nombre);
        return almacenRepository.save(almacen);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        almacenRepository.deleteById(id);
    }
}
