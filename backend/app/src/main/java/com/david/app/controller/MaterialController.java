package com.david.app.controller;

import com.david.app.model.Material;
import com.david.app.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
        Material normalized = normalize(material);
        if (materialRepository.existsByNombreAndAlmacen(normalized.getNombre(), normalized.getAlmacen())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un material con ese nombre en el almacen");
        }
        return materialRepository.save(normalized);
    }

    @PutMapping("/{id}")
    public Material updateMaterial(@PathVariable String id, @RequestBody Material material) {
        Material normalized = normalize(material);
        if (materialRepository.existsByNombreAndAlmacenAndIdNot(normalized.getNombre(), normalized.getAlmacen(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un material con ese nombre en el almacen");
        }
        normalized.setId(id);
        return materialRepository.save(normalized);
    }

    @DeleteMapping("/{id}")
    public void deleteMaterial(@PathVariable String id) {
        materialRepository.deleteById(id);
    }

    private Material normalize(Material material) {
        if (material.getNombre() == null || material.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        if (material.getAlmacen() == null || material.getAlmacen().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El almacen es obligatorio");
        }

        String nombre = material.getNombre().trim();
        String almacen = material.getAlmacen().trim();

        Integer stockTotal = material.getStockTotal() == null ? 0 : material.getStockTotal();
        Integer stockReservado = material.getStockReservado() == null ? 0 : material.getStockReservado();
        Integer stockReparacion = material.getStockReparacion() == null ? 0 : material.getStockReparacion();
        Double tarifaDia = material.getTarifaDia() == null ? 0 : material.getTarifaDia();

        if (stockTotal < 0 || stockReservado < 0 || stockReparacion < 0 || tarifaDia < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock invalido");
        }
        if (stockReservado + stockReparacion > stockTotal) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El stock reservado o en reparacion no puede superar el total");
        }

        material.setNombre(nombre);
        material.setAlmacen(almacen);
        material.setStockTotal(stockTotal);
        material.setStockReservado(stockReservado);
        material.setStockReparacion(stockReparacion);
        material.setStockDisponible(stockTotal - stockReservado - stockReparacion);
        material.setTarifaDia(tarifaDia);
        if (material.getUbicacionAlmacen() == null) {
            material.setUbicacionAlmacen("");
        }
        if (material.getEstado() == null) {
            material.setEstado("Operativo");
        }

        return material;
    }
}
