package com.david.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reparaciones")
@Data
public class Reparacion {
    @Id
    private String id;

    private String materialId;
    private String proveedorId;
    private String fechaEntrega; // YYYY-MM-DD
    private String fechaRecogida; // YYYY-MM-DD (estimada)
    private String notas;
}
