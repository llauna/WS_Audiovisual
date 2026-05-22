package com.david.app.model;

import lombok.Data;

@Data
public class PresupuestoMaterial {
    private String materialId;
    private String nombre;
    private Integer cantidad;
    private Double tarifaDia;
    private Double total;
}
