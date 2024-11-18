/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import {card, cards, filteredBills} from "../../containers/Dashboard.js";
import {localStorageMock} from "../../__mocks__/localStorage.js";
import {formatDate} from "../../app/format.js";
import Dashboard from "../../containers/Dashboard.js";
import mockedBills from '../../__mocks__/store.js';
import $ from 'jquery';

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe("filteredBills", () => {
    it("should filter bills wth accepted status", () => {
        const bills = [
         { id: 1, status: "pending" }, { id: 2, status: "accepted" },  { id: 3, status: "test" }
        ]

        const result = filteredBills(bills, "pending");
        expect(result).toEqual([{ id: 1, status: "pending"}]);
    });
});

describe("card", () => {
    it("should create a card HTML for a bill", () => {
        const bill = {
            id: 1,
            email: "test@example.com",
            name: "testName",
            amount: 100,
            date: "2022-10-05",
            type: "testType"
        };
        const result = card(bill);
        expect(result).toContain("testType");
        expect(result).toContain("100 €");
        expect(result).toContain(formatDate(bill.date));
        expect(result).toContain("testName");
    });
});

describe("when i am on Dashboard", () => {
    test("Should show modal when admin clicks on icon eye", () => {
        const dashboardInstance = new Dashboard({
            document,
            localStorage: window.localStorage,
            onNavigate: jest.fn(),
            store: mockedBills
        });

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
            type: 'Admin'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)

        const icon = document.createElement('div');
        icon.setAttribute('data-bill-url', 'https://example.com/bill.png');

        dashboardInstance.handleClickIconEye()

        expect($('#modaleFileAdmin1').modal).toHaveBeenCalledWith('show');
    });

    test("Should returns all user bills", async () => {
        const dashboardInstance = new Dashboard({
            document,
            localStorage: window.localStorage,
            onNavigate: jest.fn(),
            store: mockedBills
        });


        Object.defineProperty(window, 'localStorage', {value: localStorageMock})
        window.localStorage.setItem('user', JSON.stringify({
            type: 'Admin'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)


        expect(await dashboardInstance.getBillsAllUsers()).toEqual((await mockedBills.bills().list()))
    })

    describe("DashboardClass handleShowTickets", () => {
        let dashboard;
        const mockBills = mockedBills.bills().list();

        beforeEach(() => {
            document.body.innerHTML = `
      <div id="arrow-icon1" style="transform: rotate(90deg);"></div>
      <div id="status-bills-container1"></div>
    `;
        });


        it("should display bills when counter is even and rotate arrow to 0deg", () => {
            dashboard = new Dashboard({
                document,
                onNavigate: jest.fn(),
                store:  jest.fn(),
                localStorage: window.localStorage
            });

            const mockBills = [
                {
                    "id": "BeKy5Mo4jkmdfPGYpTxZ",
                    "vat": "",
                    "amount": 100,
                    "name": "test1",
                    "fileName": "1592770761.jpeg",
                    "commentary": "plop",
                    "pct": 20,
                    "type": "Transports",
                    "email": "a@a",
                    "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…61.jpeg?alt=media&token=7685cd61-c112-42bc-9929-8a799bb82d8b",
                    "date": "2001-01-01",
                    "status": "refused",
                    "commentAdmin": "en fait non"
                },
                {
                    "id": "UIUZtnPQvnbFnB0ozvJh",
                    "name": "test3",
                    "email": "a@a",
                    "type": "Services en ligne",
                    "vat": "60",
                    "pct": 20,
                    "commentAdmin": "bon bah d'accord",
                    "amount": 300,
                    "status": "accepted",
                    "date": "2003-03-03",
                    "commentary": "",
                    "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
                    "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
                }
            ];


            dashboard.handleShowTickets({}, mockBills, 1);

            expect(document.querySelector("#arrow-icon1").style.transform).toBe("rotate(0deg)");
            expect(document.querySelector("#status-bills-container1").innerHTML).toContain(cards(filteredBills(mockBills, "pending")));
        });

        test("should hide bills when counter is odd and rotate arrow to 90deg", () => {
            dashboard = new Dashboard({
                document,
                onNavigate: jest.fn(),
                store:  jest.fn(),
                localStorage: window.localStorage
            });

            const mockBills = [
                {
                    "id": "BeKy5Mo4jkmdfPGYpTxZ",
                    "vat": "",
                    "amount": 100,
                    "name": "test1",
                    "fileName": "1592770761.jpeg",
                    "commentary": "plop",
                    "pct": 20,
                    "type": "Transports",
                    "email": "a@a",
                    "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…61.jpeg?alt=media&token=7685cd61-c112-42bc-9929-8a799bb82d8b",
                    "date": "2001-01-01",
                    "status": "refused",
                    "commentAdmin": "en fait non"
                },
                {
                    "id": "UIUZtnPQvnbFnB0ozvJh",
                    "name": "test3",
                    "email": "a@a",
                    "type": "Services en ligne",
                    "vat": "60",
                    "pct": 20,
                    "commentAdmin": "bon bah d'accord",
                    "amount": 300,
                    "status": "accepted",
                    "date": "2003-03-03",
                    "commentary": "",
                    "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
                    "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
                }
            ];

            dashboard.handleShowTickets({}, mockBills, 1);
            dashboard.handleShowTickets({}, mockBills, 1);

            expect(document.querySelector("#arrow-icon1").style.transform).toBe("rotate(90deg)");
            expect(document.querySelector("#status-bills-container1").innerHTML).toBe("");
        });
    });
})
