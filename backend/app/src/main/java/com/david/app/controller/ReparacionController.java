package com.david.app.controller;

import com.david.app.model.Reparacion;
import com.david.app.repository.ReparacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/reparaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class ReparacionController {

    @Autowired
    private ReparacionRepository reparacionRepository;

    @GetMapping
    public List<Reparacion> getAllReparaciones() {
        return reparacionRepository.findAll();
    }

    @PostMapping
    public Reparacion saveReparacion(@RequestBody Reparacion reparacion) {
        Reparacion normalized = normalize(reparacion);
        return reparacionRepository.save(normalized);
    }

    @PutMapping("/{id}")
    public Reparacion updateReparacion(@PathVariable String id, @RequestBody Reparacion reparacion) {
        Reparacion normalized = normalize(reparacion);
        normalized.setId(id);
        return reparacionRepository.save(normalized);
    }

    @DeleteMapping("/{id}")
    public void deleteReparacion(@PathVariable String id) {
        reparacionRepository.deleteById(id);
    }

    private Reparacion normalize(Reparacion reparacion) {
        if (reparacion.getMaterialId() == null || reparacion.getMaterialId().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El material es obligatorio");
        }
        if (reparacion.getProveedorId() == null || reparacion.getProveedorId().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El proveedor es obligatorio");
        }
        if (reparacion.getFechaEntrega() == null) reparacion.setFechaEntrega("");
        if (reparacion.getFechaRecogida() == null) reparacion.setFechaRecogida("");
        if (reparacion.getNotas() == null) reparacion.setNotas("");
        return reparacion;
    }
}
