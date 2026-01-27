import "@testing-library/jest-dom"; //import that adds extra, more readable assertions for testing the DOM.
import { server } from "./tests/mocks/server";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});