/**
 * Konstanta untuk Table of Contents (Daftar Isi)
 * 
 * Menyimpan nilai-nilai yang digunakan untuk perhitungan height,
 * margin, dan dimensi TOC component.
 */
export const TOC_CONSTANTS = {
  /**
   * Offset dari dialog header (header height + padding)
   * Digunakan untuk menghitung max-height TOC
   */
  HEADER_OFFSET: '10rem',
  
  /**
   * Ukuran margin per sisi (m-4 = 1rem)
   */
  MARGIN_SIZE: '1rem',
  
  /**
   * Total margin vertikal (top + bottom)
   * Margin m-4 = 1rem per sisi = 2rem total vertikal
   */
  VERTICAL_MARGIN: '2rem',
  
  /**
   * Menghitung max-height untuk TOC
   * Formula: 100vh - header offset - vertical margin
   */
  getMaxHeight: (): string => {
    return `calc(100vh - ${TOC_CONSTANTS.HEADER_OFFSET} - ${TOC_CONSTANTS.VERTICAL_MARGIN})`;
  },
  
  /**
   * Lebar TOC saat expanded (w-48 = 12rem)
   */
  WIDTH_EXPANDED: '12rem',
  
  /**
   * Lebar TOC saat collapsed (w-12 = 3rem)
   */
  WIDTH_COLLAPSED: '3rem',
} as const;

