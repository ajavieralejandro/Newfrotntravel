import { AgenciaBackData } from '../interfaces/AgenciaBackData';

export const agenciaMock: AgenciaBackData[] = [
  {
    // Identificación
    idAgencia: '4',
    nombre: 'Vagú Viajes',
    dominio: 'vagu',
    url: 'https://travelconnect.com.ar',
    estado: true,
    password: undefined,

    // Estilos generales
    tipografia_agencia: 'Verdana',
    color_tipografia_agencia: '#2E003E',
    color_fondo_app: '#b8add5',
    color_principal: '#6A0DAD',
    color_secundario: '#e1edd7',
    color_terciario: '#4A0072',

    // Header
    header_imagen_background: null,
    header_imagen_background_opacidad: 0.1,
    header_video_background: 'https://travelconnect.com.ar/storage/vagu-viajes/imagenes/header_video_background_686845820118c.mp4',
    header_video_background_opacidad: 0.1,

    // Buscador
    buscador_tipografia: 'Verdana',
    buscador_tipografia_color: '#0d0d0d',
    buscador_tipografia_color_label: '#7B1FA2',
    buscador_inputColor: '#4A0072', // Texto morado oscuro como el terciario
    buscador_inputFondoColor: '#FFFFFF', // Fondo blanco para contraste
    buscador_color_primario: '#7B1FA2',
    buscador_color_secundario: '#e4c6f0',
    buscador_color_terciario: 'white',

    // Publicidad
    publicidad_existe: true,
    publicidad_titulo: 'VAGÚ VIAJES imperdibles',
    publicidad_tipografia_color: '#00618E',
    publicidad_color_primario: '#00618E',
    publicidad_color_secundario: '#CE93D8',
    publicidad_color_terciario: '#4A0072',

    // Tarjetas
    tarjetas_titulo: 'Destinos recomendados',
    tarjetas_tipografia: 'Verdana',
    tarjetas_tipografia_color: 'white',
    tarjetas_tipografia_color_titulo: '#00618E',
    tarjetas_tipografia_color_contenido: '#4A0072',
    tarjetas_color_primario: '#4a0387',
    tarjetas_color_secundario: 'white',
    tarjetas_color_terciario: '#4A0072',

    // Banner de registro
    banner_registro_titulo: 'Registrate y viajá con nosotros',
    banner_registro_tipografia_color: '#FFFFFF',
    banner_registro_color_primario: '#4a0387',
    banner_registro_color_secundario: '#CE93D8',
    banner_registro_color_terciario: '#4A0072',

    // Quienes somos
    quienes_somos_es:
      'En Vagu viajes, somos una agencia  dedicada a ofrecer experiencias excepcionales y memorables, adaptadas a las necesidades de cada viajero. Nos apasiona ayudar a descubrir el mundo de manera segura, emocionante y única, con un enfoque completamente personalizado para cada cliente, Creemos en la importancia de combinar la calidez humana con las últimas innovaciones tecnológicas, lo que nos permite mantenernos a la vanguardia del sector y ofrecerte siempre las mejores opciones disponibles. Esta sinergia entre lo personal y lo digital es lo que nos permite garantizarte un servicio de calidad, eficiente y adaptado a tus expectativas, En Vagu viajes, no solo organizamos viajes, sino que creamos recuerdos inolvidables, brindándote la tranquilidad y el confort que necesitas para disfrutar de cada momento. Todo nuestro esfuerzo está dirigido a brindarte una experiencia de viaje única, que combine la excelencia en el servicio con lo último en tecnología.',
    quienes_somos_en:
      'Vagú Viajes was born with the aim of offering travelers of all ages the tools and advice to explore the world in their own way.',
    quienes_somos_pt:
      'Vagú Viajes nasceu com o objetivo de oferecer aos viajantes de todas as idades as ferramentas e conselhos para explorar o mundo à sua maneira.',

    // Footer
    footer_texto: '© 2025 Vagú Viajes Leg. 19254 - Todos los derechos reservados',
    footer_tipografia: 'Montserrat',
    footer_tipografia_color: 'white',
    footer_color_primario: '#4a0387',
    footer_color_secundario: '#4a0387',
    footer_color_terciario: '#b8add5',

    // Contacto y redes
    footer_facebook: 'https://www.facebook.com/vaguviajes/?locale=es_LA',
    footer_instagram: 'https://www.instagram.com/vagu_viajes_/',
    footer_twitter: 'https://www.tiktok.com/@vag.viajes?is_from_webapp=1&sender_device=pc',
    footer_whatsapp: '5493518521370',
    footer_email: 'info@vaguviajes.tur.ar.',
    footer_telefono: '543515209192',
    footer_direccion: 'Dr. José Ramon Aguirre 3236',
    footer_ciudad: 'Res. Vélez Sarsfield, Córdoba',
    footer_pais: 'Argentina',

    // Términos y condiciones
    terminos_y_condiciones: null,

    // Multimedia
    logo: 'https://travelconnect.com.ar/storage/vagu-viajes/imagenes/logo_6851bb437a6a3.png',
    header_video: 'https://travelconnect.com.ar/storage/vagu-viajes/imagenes/header_video_background_686845820118c.mp4',
    header_imagen: null,
    publicidad_imagen_1:
      'https://travelconnect.com.ar/storage/vagu-viajes/imagenes/publicidad_imagen_1_68616cec26968.png',
    publicidad_imagen_2:
      'https://travelconnect.com.ar/storage/vagu-viajes/imagenes/publicidad_imagen_2_68616cec28457.png',
    publicidad_imagen_3:
      'https://travelconnect.com.ar/storage/vagu-viajes/imagenes/publicidad_imagen_3_68616cec28e97.png',
  },
];
