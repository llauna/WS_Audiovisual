package com.david.app.repository;

import com.david.app.model.Material;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialRepository extends MongoRepository<Material, String> {
    boolean existsByNombreAndAlmacen(String nombre, String almacen);
    boolean existsByNombreAndAlmacenAndIdNot(String nombre, String almacen, String id);
    Optional<Material> findFirstByNombreIgnoreCase(String nombre);
}
