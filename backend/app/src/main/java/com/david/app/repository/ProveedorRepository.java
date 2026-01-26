package com.david.app.repository;

import com.david.app.model.Proveedor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepository extends MongoRepository<Proveedor, String> {
    boolean existsByNombre(String nombre);
    boolean existsByNombreAndIdNot(String nombre, String id);
}
