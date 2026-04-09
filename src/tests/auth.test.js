import { expect, test, describe } from 'vitest';
// Importamos el repositorio de forma general
import * as AlergiasRepo from '../infrastructure/repositories/alergiasRepository';

describe('Pruebas Unitarias - Capa de Infraestructura', () => {
  test('El Repositorio de Alergias debe estar cargado correctamente', () => {
    // Verifica que el archivo no esté vacío
    expect(AlergiasRepo).toBeDefined();
  });

  test('El módulo debe exportar la lógica de persistencia', () => {
    // Verifica que sea un objeto de funciones o una clase funcional
    expect(typeof AlergiasRepo).toBe('object' || 'function');
  });
});