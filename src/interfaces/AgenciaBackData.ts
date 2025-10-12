// src/interfaces/AgenciaBackData.ts

export interface AgenciaBackData {
  // --- Identificación y acceso ---
  idAgencia: string;
  nombre: string;
  dominio: string;
  url: string;
  estado: boolean;
  password?: string;

  // --- Estilo general ---
  tipografia_agencia: string;
  color_tipografia_agencia: string;
  color_fondo_app: string;
  color_principal: string;
  color_secundario: string;
  color_terciario: string;

  // --- Header ---
  header_imagen_background: string | null;
  header_imagen_background_opacidad: number;
  header_video_background: string | null;
  header_video_background_opacidad: number;

  // --- Buscador ---
  buscador_tipografia: string;
  buscador_tipografia_color: string;
  buscador_tipografia_color_label: string;
  buscador_inputColor: string;
  buscador_inputFondoColor: string;
  buscador_color_primario: string;
  buscador_color_secundario: string;
  buscador_color_terciario: string;

  // --- Publicidad cliente ---
  publicidad_existe: boolean;
  publicidad_titulo: string;
  publicidad_tipografia_color: string;
  publicidad_color_primario: string;
  publicidad_color_secundario: string;
  publicidad_color_terciario: string;

  // --- Tarjetas ---
  tarjetas_titulo: string;
  tarjetas_tipografia: string;
  tarjetas_tipografia_color: string;
  tarjetas_tipografia_color_titulo: string;
  tarjetas_tipografia_color_contenido: string;
  tarjetas_color_primario: string;
  tarjetas_color_secundario: string;
  tarjetas_color_terciario: string;

  // --- Banner de registro ---
  banner_registro_titulo: string;
  banner_registro_tipografia_color: string;
  banner_registro_color_primario: string;
  banner_registro_color_secundario: string;
  banner_registro_color_terciario: string;

  // --- Quiénes somos ---
  quienes_somos_es: string;
  quienes_somos_en: string;
  quienes_somos_pt: string;

  // --- Footer ---
  footer_texto: string;
  footer_tipografia: string;
  footer_tipografia_color: string;
  footer_color_primario: string;
  footer_color_secundario: string;
  footer_color_terciario: string;

  // --- Contacto y redes ---
  footer_facebook: string;
  footer_instagram: string;
  footer_twitter: string;
  footer_whatsapp: string;
  footer_email: string;
  footer_telefono: string;
  footer_direccion: string;
  footer_ciudad: string;
  footer_pais: string;

  // --- Términos y condiciones ---
  terminos_y_condiciones: string | null;

  // --- Multimedia ---
  logo: string | null;
  header_video: string | null;
  header_imagen: string | null;
  publicidad_imagen_1: string | null;
  publicidad_imagen_2: string | null;
  publicidad_imagen_3: string | null;
}
