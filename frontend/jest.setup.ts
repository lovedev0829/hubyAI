// Jest setup file

import "@testing-library/jest-dom";
jest.mock("swiper/css", () => {});
jest.mock("swiper/css/navigation", () => {});
jest.mock("swiper/css/pagination", () => {});
jest.mock("swiper/css/scrollbar", () => {});
jest.mock("swiper/modules", () => ({
  Swiper: () => {},
  SwiperSlide: () => {},
  Autoplay: () => {},
  Navigation: () => {},
}));

// Mock window.matchMedia to prevent errors related to media queries
global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false, // By default, this will simulate that no media query matches
  media: query, // Include the query string to match the expected MediaQueryList structure
  addListener: jest.fn(), // Mock addListener method
  removeListener: jest.fn(), // Mock removeListener method
  addEventListener: jest.fn(), // Mock addEventListener method (newer method)
  removeEventListener: jest.fn(), // Mock removeEventListener method
  dispatchEvent: jest.fn(), // Mock dispatchEvent method
}));

// Mock window.alert to prevent alert popups in tests
window.alert = jest.fn();
