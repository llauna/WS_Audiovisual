package com.david.app.controller;

import com.david.app.model.SolicitudPresupuesto;
import com.david.app.repository.SolicitudPresupuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes-presupuesto")
@CrossOrigin(origins = "http://localhost:4200")
public class SolicitudPresupuestoController {

    @Autowired
    private SolicitudPresupuestoRepository solicitudRepository;

    @GetMapping
    public List<SolicitudPresupuesto> getAllSolicitudes() {
        return solicitudRepository.findAll();
    }

    @PostMapping
    public SolicitudPresupuesto saveSolicitud(@RequestBody SolicitudPresupuesto solicitud) {
        SolicitudPresupuesto normalized = normalize(solicitud);
        return solicitudRepository.save(normalized);
    }

    @PutMapping("/{id}")
    public SolicitudPresupuesto updateSolicitud(@PathVariable String id, @RequestBody SolicitudPresupuesto solicitud) {
        SolicitudPresupuesto normalized = normalize(solicitud);
        normalized.setId(id);
        return solicitudRepository.save(normalized);
    }

    @DeleteMapping("/{id}")
    public void deleteSolicitud(@PathVariable String id) {
        solicitudRepository.deleteById(id);
    }

    private SolicitudPresupuesto normalize(SolicitudPresupuesto solicitud) {
        if (solicitud.getProveedorId() == null || solicitud.getProveedorId().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El proveedor es obligatorio");
        }
        if (solicitud.getMaterialId() == null || solicitud.getMaterialId().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El material es obligatorio");
        }
        Double precio = solicitud.getPrecio() == null ? 0 : solicitud.getPrecio();
        if (precio < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El precio no puede ser negativo");
        }
        solicitud.setPrecio(precio);
        if (solicitud.getFechaRecogida() == null) solicitud.setFechaRecogida("");
        if (solicitud.getFechaDevolucion() == null) solicitud.setFechaDevolucion("");
        if (solicitud.getNotas() == null) solicitud.setNotas("");
        return solicitud;
    }
}
