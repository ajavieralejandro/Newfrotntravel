// src/utils/compartir/generarUrlCompartir.test.ts

import { generarUrlCompartir, generarUrlCompartirConDominio } from './generarUrlCompartir';

// Mock de import.meta.env
const mockEnv = {
  VITE_PUBLIC_URL: undefined as string | undefined
};

// Mock de window.location
const mockLocation = {
  origin: 'http://localhost:3000'
};

// Simular import.meta.env y window.location
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockEnv
    }
  }
});

Object.defineProperty(globalThis, 'window', {
  value: {
    location: mockLocation
  }
});

describe('generarUrlCompartir', () => {
  beforeEach(() => {
    // Reset mocks
    mockEnv.VITE_PUBLIC_URL = undefined;
    mockLocation.origin = 'http://localhost:3000';
  });

  test('debe usar variable de entorno cuando está disponible', () => {
    mockEnv.VITE_PUBLIC_URL = 'https://produccion.com';
    
    const url = generarUrlCompartir(123);
    
    expect(url).toBe('https://produccion.com/paquetes-busqueda/123');
  });

  test('debe usar URL de agencia cuando está disponible', () => {
    const url = generarUrlCompartir(123, null, 'https://www.miagencia.com');
    
    expect(url).toBe('https://www.miagencia.com/paquetes-busqueda/123');
  });

  test('debe usar dominio de agencia cuando está disponible', () => {
    const url = generarUrlCompartir(123, 'www.miagencia.com');
    
    expect(url).toBe('https://www.miagencia.com/paquetes-busqueda/123');
  });

  test('debe agregar protocolo https al dominio si no lo tiene', () => {
    const url = generarUrlCompartir(123, 'miagencia.com');
    
    expect(url).toBe('https://miagencia.com/paquetes-busqueda/123');
  });

  test('debe usar window.location.origin como fallback', () => {
    mockLocation.origin = 'https://app.travelconnect.com';
    
    const url = generarUrlCompartir(123);
    
    expect(url).toBe('https://app.travelconnect.com/paquetes-busqueda/123');
  });

  test('debe remover barra final de URLs', () => {
    const url1 = generarUrlCompartir(123, null, 'https://www.miagencia.com/');
    const url2 = generarUrlCompartir(123, 'https://miagencia.com/');
    
    expect(url1).toBe('https://www.miagencia.com/paquetes-busqueda/123');
    expect(url2).toBe('https://miagencia.com/paquetes-busqueda/123');
  });

  test('debe priorizar variable de entorno sobre datos de agencia', () => {
    mockEnv.VITE_PUBLIC_URL = 'https://produccion.com';
    
    const url = generarUrlCompartir(123, 'www.miagencia.com', 'https://www.miagencia.com');
    
    expect(url).toBe('https://produccion.com/paquetes-busqueda/123');
  });

  test('debe priorizar URL de agencia sobre dominio de agencia', () => {
    const url = generarUrlCompartir(123, 'www.miagencia.com', 'https://custom.miagencia.com');
    
    expect(url).toBe('https://custom.miagencia.com/paquetes-busqueda/123');
  });
});

describe('generarUrlCompartirConDominio', () => {
  test('debe usar dominio proporcionado', () => {
    const url = generarUrlCompartirConDominio(456, 'https://www.ejemplo.com');
    
    expect(url).toBe('https://www.ejemplo.com/paquetes-busqueda/456');
  });

  test('debe usar window.location.origin si no se proporciona dominio', () => {
    mockLocation.origin = 'https://localhost:3000';
    
    const url = generarUrlCompartirConDominio(456);
    
    expect(url).toBe('https://localhost:3000/paquetes-busqueda/456');
  });
});
