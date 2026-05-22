package com.david.app.service;

import com.david.app.dto.PresupuestoDetalle;
import com.david.app.dto.PresupuestoLineaMaterial;
import com.david.app.dto.PresupuestoLineaTecnico;
import com.david.app.model.Evento;
import com.david.app.model.EventoMaterial;
import com.david.app.model.EventoTecnico;
import com.david.app.model.Material;
import com.david.app.model.Personal;
import com.david.app.repository.MaterialRepository;
import com.david.app.repository.PersonalRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
public class PresupuestoCalculatorService {

    private final MaterialRepository materialRepository;
    private final PersonalRepository personalRepository;

    public PresupuestoCalculatorService(MaterialRepository materialRepository, PersonalRepository personalRepository) {
        this.materialRepository = materialRepository;
        this.personalRepository = personalRepository;
    }

    public PresupuestoDetalle calcular(Evento evento, Double margenPct) {
        PresupuestoDetalle detalle = new PresupuestoDetalle();
        if (evento == null) {
            detalle.setMateriales(Collections.emptyList());
            detalle.setTecnicos(Collections.emptyList());
            detalle.setMargenPct(normalizeMargen(margenPct));
            detalle.setCosteMateriales(0d);
            detalle.setCosteTecnicos(0d);
            detalle.setCosteBase(0d);
            detalle.setMargenImporte(0d);
            detalle.setTotal(0d);
            detalle.setMultiplicador(0d);
            return detalle;
        }

        double multiplicador = resolveMultiplicador(evento);
        double costeMateriales = 0d;
        double costeTecnicos = 0d;

        List<PresupuestoLineaMaterial> lineasMateriales = (evento.getMateriales() == null ? Collections.<EventoMaterial>emptyList() : evento.getMateriales())
            .stream()
            .filter(Objects::nonNull)
            .map(item -> buildLineaMaterial(item, multiplicador))
            .toList();

        for (PresupuestoLineaMaterial linea : lineasMateriales) {
            costeMateriales += safe(linea.getTotal());
        }

        List<PresupuestoLineaTecnico> lineasTecnicos = (evento.getTecnicosDetalle() == null ? Collections.<EventoTecnico>emptyList() : evento.getTecnicosDetalle())
            .stream()
            .filter(Objects::nonNull)
            .map(item -> buildLineaTecnico(item, multiplicador))
            .toList();

        for (PresupuestoLineaTecnico linea : lineasTecnicos) {
            costeTecnicos += safe(linea.getTotal());
        }

        double costeBase = costeMateriales + costeTecnicos;
        double margenNormalizado = normalizeMargen(margenPct);
        double margenImporte = costeBase * (margenNormalizado / 100d);

        detalle.setEventoId(evento.getId());
        detalle.setEventoTitulo(evento.getTitulo());
        detalle.setModoCalculo(evento.getModoCalculo());
        detalle.setDias(evento.getDias());
        detalle.setJornadas(evento.getJornadas());
        detalle.setMultiplicador(multiplicador);
        detalle.setCosteMateriales(costeMateriales);
        detalle.setCosteTecnicos(costeTecnicos);
        detalle.setCosteBase(costeBase);
        detalle.setMargenPct(margenNormalizado);
        detalle.setMargenImporte(margenImporte);
        detalle.setTotal(costeBase + margenImporte);
        detalle.setMateriales(lineasMateriales);
        detalle.setTecnicos(lineasTecnicos);
        return detalle;
    }

    private PresupuestoLineaMaterial buildLineaMaterial(EventoMaterial item, double multiplicador) {
        PresupuestoLineaMaterial linea = new PresupuestoLineaMaterial();
        Integer cantidad = item.getCantidad() == null ? 0 : item.getCantidad();
        Material material = lookupMaterial(item.getMaterialId());
        double tarifaDia = material != null && material.getTarifaDia() != null ? material.getTarifaDia() : 0d;
        linea.setMaterialId(item.getMaterialId());
        linea.setNombre(resolveMaterialName(item, material));
        linea.setCantidad(cantidad);
        linea.setTarifaDia(tarifaDia);
        linea.setTotal(cantidad * tarifaDia * multiplicador);
        return linea;
    }

    private PresupuestoLineaTecnico buildLineaTecnico(EventoTecnico item, double multiplicador) {
        PresupuestoLineaTecnico linea = new PresupuestoLineaTecnico();
        double horas = item.getHoras() == null ? 0d : item.getHoras();
        Personal personal = lookupPersonal(item.getPersonalId());
        double tarifaHora = item.getTarifaHora() != null
            ? item.getTarifaHora()
            : personal != null && personal.getTarifaHora() != null ? personal.getTarifaHora() : 0d;
        linea.setPersonalId(item.getPersonalId());
        linea.setNombre(resolvePersonalName(item, personal));
        linea.setHoras(horas);
        linea.setTarifaHora(tarifaHora);
        linea.setTotal(horas * tarifaHora * multiplicador);
        return linea;
    }

    private Material lookupMaterial(String materialId) {
        if (materialId == null || materialId.isBlank()) {
            return null;
        }
        Material byId = materialRepository.findById(materialId).orElse(null);
        if (byId != null) {
            return byId;
        }
        return materialRepository.findFirstByNombreIgnoreCase(materialId).orElse(null);
    }

    private Personal lookupPersonal(String personalId) {
        if (personalId == null || personalId.isBlank()) {
            return null;
        }
        return personalRepository.findById(personalId).orElse(null);
    }

    private String resolveMaterialName(EventoMaterial item, Material material) {
        if (material != null && material.getNombre() != null && !material.getNombre().isBlank()) {
            return material.getNombre();
        }
        if (item.getNombre() != null && !item.getNombre().isBlank()) {
            return item.getNombre();
        }
        return "Sin nombre";
    }

    private String resolvePersonalName(EventoTecnico item, Personal personal) {
        if (personal != null) {
            String nombre = joinName(personal.getNombre(), personal.getApellidos());
            if (!nombre.isBlank()) {
                return nombre;
            }
        }
        if (item.getNombre() != null && !item.getNombre().isBlank()) {
            return item.getNombre();
        }
        return "Sin nombre";
    }

    private String joinName(String nombre, String apellidos) {
        String first = nombre == null ? "" : nombre.trim();
        String last = apellidos == null ? "" : apellidos.trim();
        if (first.isEmpty()) {
            return last;
        }
        if (last.isEmpty()) {
            return first;
        }
        return String.format(Locale.ROOT, "%s %s", first, last);
    }

    private double resolveMultiplicador(Evento evento) {
        if ("Jornadas".equalsIgnoreCase(evento.getModoCalculo())) {
            return eventHasPositiveValue(evento.getJornadas()) ? evento.getJornadas() : 1d;
        }
        return eventHasPositiveValue(evento.getDias()) ? evento.getDias() : 1d;
    }

    private boolean eventHasPositiveValue(Integer value) {
        return value != null && value > 0;
    }

    private double normalizeMargen(Double margenPct) {
        return margenPct == null || margenPct < 0 ? 0d : margenPct;
    }

    private double safe(Double value) {
        return value == null ? 0d : value;
    }
}
