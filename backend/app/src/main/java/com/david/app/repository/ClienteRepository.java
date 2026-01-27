package com.david.app.repository;

import com.david.app.model.Cliente;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends MongoRepository<Cliente, String> {
    boolean existsByNombre(String nombre);
    boolean existsByNombreAndIdNot(String nombre, String id);
}
