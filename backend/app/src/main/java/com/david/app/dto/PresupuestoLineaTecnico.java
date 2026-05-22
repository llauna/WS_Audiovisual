package com.david.app.dto;

import lombok.Data;

@Data
public class PresupuestoLineaTecnico {
    private String personalId;
    private String nombre;
    private Double horas;
    private Double tarifaHora;
    private Double total;
}
