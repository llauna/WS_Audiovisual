package com.david.app.repository;

import com.david.app.model.Reparacion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReparacionRepository extends MongoRepository<Reparacion, String> {
}
