package com.david.app.repository;

import com.david.app.model.Presupuesto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresupuestoRepository extends MongoRepository<Presupuesto, String> {
    List<Presupuesto> findByEventoIdOrderByCreatedAtDesc(String eventoId);
}
