package com.david.app.controller;

import com.david.app.model.Proveedor;
import com.david.app.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "http://localhost:4200")
public class ProveedorController {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @GetMapping
    public List<Proveedor> getAllProveedores() {
        return proveedorRepository.findAll();
    }

    @PostMapping
    public Proveedor saveProveedor(@RequestBody Proveedor proveedor) {
        Proveedor normalized = normalize(proveedor);
        if (proveedorRepository.existsByNombre(normalized.getNombre())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un proveedor con ese nombre");
        }
        return proveedorRepository.save(normalized);
    }

    @PutMapping("/{id}")
    public Proveedor updateProveedor(@PathVariable String id, @RequestBody Proveedor proveedor) {
        Proveedor normalized = normalize(proveedor);
        if (proveedorRepository.existsByNombreAndIdNot(normalized.getNombre(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un proveedor con ese nombre");
        }
        normalized.setId(id);
        return proveedorRepository.save(normalized);
    }

    @DeleteMapping("/{id}")
    public void deleteProveedor(@PathVariable String id) {
        proveedorRepository.deleteById(id);
    }

    private Proveedor normalize(Proveedor proveedor) {
        if (proveedor.getNombre() == null || proveedor.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        proveedor.setNombre(proveedor.getNombre().trim());
        if (proveedor.getNif() == null) proveedor.setNif("");
        if (proveedor.getEmail() == null) proveedor.setEmail("");
        if (proveedor.getTelefono() == null) proveedor.setTelefono("");
        if (proveedor.getDireccion() == null) proveedor.setDireccion("");
        if (proveedor.getContacto() == null) proveedor.setContacto("");
        if (proveedor.getNotas() == null) proveedor.setNotas("");
        if (proveedor.getProveedorMaterial() == null) proveedor.setProveedorMaterial(false);
        if (proveedor.getProveedorReparacion() == null) proveedor.setProveedorReparacion(false);
        return proveedor;
    }
}
