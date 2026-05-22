package com.david.app.model;

import lombok.Data;

@Data
public class PresupuestoTecnico {
    private String personalId;
    private String nombre;
    private Double horas;
    private Double tarifaHora;
    private Double total;
}
