/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import NewBillUI from "../../views/NewBillUI.js";
import {localStorageMock} from "../../__mocks__/localStorage.js";
import NewBill from "../../containers/NewBill.js";
import {fireEvent, screen} from "@testing-library/dom";
import {ROUTES_PATH} from "../../constants/routes.js";

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill form", () => {
        test("should handle submit data", () => {
            document.body.innerHTML = NewBillUI();

            Object.defineProperty(window, 'localStorage', { value: localStorageMock });
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const mockStore = {
                bills: jest.fn().mockImplementation(() => {
                    return {
                        update: jest.fn().mockResolvedValue({}),
                    };
                }),
                updateBill: jest.fn()
            };

            const onNavigateMock = jest.fn();

            const newBillInstance = new NewBill({
                document,
                localStorage: window.localStorage,
                onNavigate: onNavigateMock,
                store: mockStore
            });

            const form = screen.getByTestId("form-new-bill");
            form.addEventListener("submit", newBillInstance.handleSubmit);
            fireEvent.submit(form);

            expect(newBillInstance.onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
        });

        test("Should handle change file", async () => {
            Object.defineProperty(window, 'localStorage', {value: localStorageMock});
            window.localStorage.setItem('user', JSON.stringify({email: 'test@user.com'}));

            const mockStore = {
                bills() {
                    return {
                        create: jest.fn().mockResolvedValue({
                            fileUrl: 'https://mockurl.com/file.png',
                            key: '12345'
                        })
                    };
                }
            };

            const mockFile = new File(['test'], 'test.png', {type: 'image/png'});
            const fileEvent = {
                preventDefault: jest.fn(),
                target: {value: 'C:\\testPath\\test.png'},
            };
            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({
                document,
                onNavigate: jest.fn(),
                store: mockStore,
                localStorage: window.localStorage,
            });

            const fileInput = screen.getByTestId("file");

            Object.defineProperty(fileInput, 'files', {value: [mockFile]});
            await newBill.handleChangeFile(fileEvent);

            expect(newBill.fileUrl).toBe('https://mockurl.com/file.png');
            expect(newBill.fileName).toBe('test.png');
            expect(newBill.billId).toBe('12345');
        });

        describe('When we call displayFileErrors', function () {
            test("Should display error message", async () => {
                Object.defineProperty(window, 'localStorage', {value: localStorageMock});
                window.localStorage.setItem('user', JSON.stringify({email: 'test@user.com'}));

                document.body.innerHTML = NewBillUI();

                const newBill = new NewBill({
                    document,
                    onNavigate: jest.fn(),
                    store: jest.fn(),
                    localStorage: window.localStorage,
                });

                newBill.displayFileErrors();
                newBill.displayFileErrors();

                const errorMessages = document.querySelectorAll("#fileErrors");
                expect(errorMessages.length).toBe(1);
            });

            test("Should call displayFileErrors when an unsupported file type is uploaded", async () => {
                Object.defineProperty(window, 'localStorage', { value: localStorageMock });
                window.localStorage.setItem('user', JSON.stringify({ email: 'test@user.com' }));

                const mockStore = {
                    bills() {
                        return {
                            create: jest.fn().mockResolvedValue({
                                fileUrl: 'https://mockurl.com/file.png',
                                key: '12345'
                            })
                        };
                    }
                };

                const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
                const fileEvent = {
                    preventDefault: jest.fn(),
                    target: { value: 'C:\\testPath\\test.pdf' },
                };

                document.body.innerHTML = NewBillUI();
                const newBill = new NewBill({
                    document,
                    onNavigate: jest.fn(),
                    store: mockStore,
                    localStorage: window.localStorage,
                });

                const fileInput = screen.getByTestId("file");
                Object.defineProperty(fileInput, 'files', { value: [mockFile] });

                await newBill.handleChangeFile(fileEvent);

                const errorSpan = document.getElementById("fileErrors");
                expect(errorSpan).not.toBeNull();
            });

        });
    });
});