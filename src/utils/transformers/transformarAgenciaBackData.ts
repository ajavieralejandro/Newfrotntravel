// src/utils/transformers/transformarAgenciaBackData.ts
import { AgenciaBackData } from "../../interfaces/AgenciaBackData";
import { DatosAgencia } from "../../interfaces/datosAgencia";

export function transformarAgenciaBackData(data: AgenciaBackData): DatosAgencia {
  return {
    /** 🔹 Datos Generales */
    idAgencia: Number(data.idAgencia),
    nombreAgencia: data.nombre || "",
    dominio: data.dominio || null,
    url: data.url || null,
    logoAgencia: data.logo || null,
    tipografiaAgencia: data.tipografia_agencia || null,
    colorTipografiaAgencia: data.color_tipografia_agencia || null,
    colorFondoApp: data.color_fondo_app || null,
    color: {
      primario: data.color_principal || null,
      secundario: data.color_secundario || null,
      terciario: data.color_terciario || null,
    },
    terminosYCondiciones: data.terminos_y_condiciones || null,

    /** 🔹 Header */
    header: {
      imagenBackground: data.header_imagen_background || null,
      imagenBackgroundOpacidad: Number(data.header_imagen_background_opacidad) || null,
      videoBackground: data.header_video_background || null,
      videoBackgroundOpacidad: Number(data.header_video_background_opacidad) || null,
    },

    /** 🔹 Buscador */
    buscador: {
      tipografia: data.buscador_tipografia || null,
      tipografiaColor: data.buscador_tipografia_color || null,
      tipografiaColorLabel: data.buscador_tipografia_color_label || null,
      inputColor: data.buscador_inputColor || null,
      inputFondoColor: data.buscador_inputFondoColor || null,
      color: {
        primario: data.buscador_color_primario || null,
        secundario: data.buscador_color_secundario || null,
        terciario: data.buscador_color_terciario || null,
      },
    },

    /** 🔹 Publicidad Cliente */
    publicidadCliente: {
      existe: Boolean(data.publicidad_existe),
      titulo: data.publicidad_titulo || null,
      tipografiaColor: data.publicidad_tipografia_color || null,
      color: {
        primario: data.publicidad_color_primario || null,
        secundario: data.publicidad_color_secundario || null,
        terciario: data.publicidad_color_terciario || null,
      },
      imagenes: [
        data.publicidad_imagen_1 || null,
        data.publicidad_imagen_2 || null,
        data.publicidad_imagen_3 || null,
      ],
    },

    /** 🔹 Tarjetas */
    tarjetas: {
      titulo: data.tarjetas_titulo || null,
      tipografia: data.tarjetas_tipografia || null,
      tipografiaColor: data.tarjetas_tipografia_color || null,
      tipografiaColorTitulo: data.tarjetas_tipografia_color_titulo || null,
      tipografiaColorContenido: data.tarjetas_tipografia_color_contenido || null,
      color: {
        primario: data.tarjetas_color_primario || null,
        secundario: data.tarjetas_color_secundario || null,
        terciario: data.tarjetas_color_terciario || null,
      },
    },

    /** 🔹 Banner de Registro */
    bannerRegistro: {
      titulo: data.banner_registro_titulo || null,
      tipografiaColor: data.banner_registro_tipografia_color || null,
      color: {
        primario: data.banner_registro_color_primario || null,
        secundario: data.banner_registro_color_secundario || null,
        terciario: data.banner_registro_color_terciario || null,
      },
    },

    /** 🔹 Quiénes Somos */
    quienesSomos: {
      quienes_somos_es: data.quienes_somos_es || null,
      quienes_somos_en: data.quienes_somos_en || null,
      quienes_somos_pt: data.quienes_somos_pt || null,
    },

    /** 🔹 Footer */
    footer: {
      texto: data.footer_texto || null,
      tipografia: data.footer_tipografia || null,
      tipografiaColor: data.footer_tipografia_color || null,
      color: {
        primario: data.footer_color_primario || null,
        secundario: data.footer_color_secundario || null,
        terciario: data.footer_color_terciario || null,
      },
      redes: {
        facebook: data.footer_facebook || null,
        twitter: data.footer_twitter || null,
        instagram: data.footer_instagram || null,
        whatsapp: data.footer_whatsapp || null,
      },
      contacto: {
        telefono: data.footer_telefono || null,
        email: data.footer_email || null,
      },
      ubicacion: {
        direccion: data.footer_direccion || null,
        ciudad: data.footer_ciudad || null,
        pais: data.footer_pais || null,
      },
    },
  };
}
