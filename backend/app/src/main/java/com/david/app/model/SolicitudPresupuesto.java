package com.david.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "solicitudes_presupuesto")
@Data
public class SolicitudPresupuesto {
    @Id
    private String id;

    private String proveedorId;
    private String materialId;
    private Double precio;
    private String fechaRecogida; // YYYY-MM-DD
    private String fechaDevolucion; // YYYY-MM-DD
    private String notas;
}
