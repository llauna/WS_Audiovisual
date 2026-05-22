package com.david.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "presupuestos")
@Data
public class Presupuesto {
    @Id
    private String id;

    private String eventoId;
    private String eventoTitulo;
    private String clienteId;
    private String fechaEvento;
    private String modoCalculo;
    private Integer dias;
    private Integer jornadas;
    private Double multiplicador;
    private Double margenPct;
    private Double costeMateriales;
    private Double costeTecnicos;
    private Double costeBase;
    private Double margenImporte;
    private Double importePresentado;
    private String estado;
    private String createdAt;
    private List<PresupuestoMaterial> materiales;
    private List<PresupuestoTecnico> tecnicos;
}
