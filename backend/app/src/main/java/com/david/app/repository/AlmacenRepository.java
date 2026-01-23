package com.david.app.repository;

import com.david.app.model.Almacen;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlmacenRepository extends MongoRepository<Almacen, String> {
    boolean existsByNombre(String nombre);
    boolean existsByNombreAndIdNot(String nombre, String id);
}
