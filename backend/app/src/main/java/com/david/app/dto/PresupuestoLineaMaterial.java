package com.david.app.dto;

import lombok.Data;

@Data
public class PresupuestoLineaMaterial {
    private String materialId;
    private String nombre;
    private Integer cantidad;
    private Double tarifaDia;
    private Double total;
}
