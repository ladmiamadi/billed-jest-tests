/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js"
import '@testing-library/jest-dom';
import {screen} from "@testing-library/dom";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("should display form", () => {
      document.body.innerHTML = NewBillUI();

      const form = screen.getByTestId("form-new-bill");
      const select = screen.getByTestId("expense-type");

      expect(form).toBeInTheDocument();
      expect(select).toBeInTheDocument();
    })
  })
})
