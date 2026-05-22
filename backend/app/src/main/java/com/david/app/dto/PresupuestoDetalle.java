package com.david.app.dto;

import lombok.Data;

import java.util.List;

@Data
public class PresupuestoDetalle {
    private String eventoId;
    private String eventoTitulo;
    private String modoCalculo;
    private Integer dias;
    private Integer jornadas;
    private Double multiplicador;
    private Double costeMateriales;
    private Double costeTecnicos;
    private Double costeBase;
    private Double margenPct;
    private Double margenImporte;
    private Double total;
    private List<PresupuestoLineaMaterial> materiales;
    private List<PresupuestoLineaTecnico> tecnicos;
}
