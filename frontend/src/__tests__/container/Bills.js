/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import $ from 'jquery'
import {screen} from '@testing-library/dom'
import BillsUI from "../../views/BillsUI.js";
import {bills} from "../../fixtures/bills.js";
import Instance from '../../containers/Bills.js';
import {localStorageMock} from "../../__mocks__/localStorage.js";
import router from "../../app/Router.js";
import {ROUTES_PATH} from "../../constants/routes.js";
import store from "../../app/Store.js";
import mockedBills from '../../__mocks__/store.js'
import {formatDate, formatStatus} from "../../app/format.js";

describe("Given i am connected as employee", ()=> {
    describe("When I am on Bills Page", () => {
        test("Should display icon eyes", async () => {
            document.body.innerHTML = BillsUI({ data: [bills[0]] })
            const eyeIcon = screen.getByTestId('icon-eye')

            expect(eyeIcon).toBeInTheDocument();
        });

        test("Should display bills", async () => {

            const billsList = new Instance({
                document,
                onNavigate: jest.fn(),
                store: mockedBills,
                localStorage: window.localStorage,
            });
            const mockedFormatDate = jest.spyOn(require("../../app/format.js"), "formatDate");
            const mockedFormatStatus = jest.spyOn(require("../../app/format.js"), "formatStatus")

            expect(billsList.getBills()).toEqual(mockedBills.bills().list());
            expect(mockedFormatDate).toHaveBeenCalledTimes((await mockedBills.bills().list()).length);
            expect(mockedFormatStatus).toHaveBeenCalledTimes((await mockedBills.bills().list()).length);

        })

    describe("When I click on icon eye", () => {
        test("should open Modal", () => {
            jest.mock('jquery', () => {
                const $ = jest.fn(() => $);
                $.width = jest.fn().mockReturnValue(500);
                $.find = jest.fn().mockReturnThis();
                $.html = jest.fn().mockReturnThis();
                return $;
            });

            $.fn.modal = jest.fn();

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)

            const billClass = new Instance({
                document,
                onNavigate,
                store,
                localStorage: window.localStorage,
            });

            const icon = document.createElement('div');
            icon.setAttribute('data-bill-url', 'https://example.com/bill.png');

            billClass.handleClickIconEye(icon);

            expect($('#modaleFile').modal).toHaveBeenCalledWith('show');
        })
    })

    describe("When i click on new bill button", () => {
        test("Should navigate to new bill path", () => {
            let billsClass;
            let mockOnNavigate;

            mockOnNavigate = jest.fn();

            billsClass = new Instance({
                document,
                onNavigate: mockOnNavigate,
                store: null,
                localStorage: window.localStorage
            });

            billsClass.handleClickNewBill()

            expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
        })
    })
    })
})



