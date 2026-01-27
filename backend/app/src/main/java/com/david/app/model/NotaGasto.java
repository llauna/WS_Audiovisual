package com.david.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notas_gastos")
@Data
public class NotaGasto {
    @Id
    private String id;

    private String eventoId;
    private String productorId;
    private String fecha; // YYYY-MM-DD
    private String concepto;
    private Double importe;
    private String estado; // Pendiente / Pagado
}
