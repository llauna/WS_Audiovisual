package com.david.app.repository;

import com.david.app.model.SolicitudPresupuesto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudPresupuestoRepository extends MongoRepository<SolicitudPresupuesto, String> {
}
