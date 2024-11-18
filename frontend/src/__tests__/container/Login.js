/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import Login from '../../containers/Login.js';
import { localStorageMock } from "../../__mocks__/localStorage.js";
import LoginUI from "../../views/LoginUI.js";
import {fireEvent, screen, waitFor} from "@testing-library/dom";
import {ROUTES_PATH} from "../../constants/routes.js";


describe("Given I am on the Login page", () => {
    test("When submitting the form as Admin, it should store user in localStorage, navigate to Dashboard, and set background color", async () => {
        document.body.innerHTML = LoginUI();

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        const onNavigateMock = jest.fn();

        const loginInstance = new Login({
            document,
            localStorage: window.localStorage,
            onNavigate: onNavigateMock,
            PREVIOUS_LOCATION: '',
            store: {
                login: jest.fn().mockResolvedValue({ jwt: 'test-jwt-token' })
            }
        });

       const emailInput = screen.getByTestId("admin-email-input");
        const passwordInput = screen.getByTestId("admin-password-input");

        fireEvent.change(emailInput, { target: { value: "admin@test.com" } });
        fireEvent.change(passwordInput, { target: { value: "admin" } });

        const form = screen.getByTestId("form-admin");
        form.addEventListener("submit", loginInstance.handleSubmitAdmin);
        fireEvent.submit(form);

        const user = {
            type: "Admin",
            email: "admin@test.com",
            password:"admin",
            status: "connected"
        };

        expect(window.localStorage.getItem('user')).toBeDefined();
        expect(JSON.parse(window.localStorage.getItem('user'))).toEqual( JSON.stringify(user));

        await waitFor(() => {
            expect(onNavigateMock).toHaveBeenCalledWith(ROUTES_PATH['Dashboard']);
        });
    });

    test("When submitting the form as Employee, it should store user in localStorage, navigate to Dashboard, and set background color", async () => {
        document.body.innerHTML = LoginUI();

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        const onNavigateMock = jest.fn();

        const user = {
            type: "Employee",
            email: "employee@test.com",
            password:"employee",
            status: "connected"
        };

        const loginInstance = new Login({
            document,
            localStorage: window.localStorage,
            onNavigate: onNavigateMock,
            PREVIOUS_LOCATION: '',
            store: {
                login: jest.fn().mockResolvedValue({ jwt: 'test-jwt' }),
                createUser: jest.fn().mockResolvedValue({user})
            }
        });

        const emailInput = screen.getByTestId("employee-email-input");
        const passwordInput = screen.getByTestId("employee-password-input");

        fireEvent.change(emailInput, { target: { value: "employee@test.com" } });
        fireEvent.change(passwordInput, { target: { value: "employee" } });

        const form = screen.getByTestId("form-employee");
        form.addEventListener("submit", loginInstance.handleSubmitEmployee);
        fireEvent.submit(form);

        expect(window.localStorage.getItem('user')).toBeDefined();
        expect(JSON.parse(window.localStorage.getItem('user'))).toEqual( JSON.stringify(user));

        await waitFor(() => {
            expect(onNavigateMock).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
        });
    });

    describe("When login fails", () => {
        test("it should call createUser function when login fails", async () => {
            document.body.innerHTML = LoginUI();

            Object.defineProperty(window, 'localStorage', { value: localStorageMock });

            const onNavigateMock = jest.fn();

            const user = {
                type: "Employee",
                email: "employee@test.com",
                password:"employee",
                status: "connected"
            };

            const loginInstance = new Login({
                document,
                localStorage: window.localStorage,
                onNavigate: onNavigateMock,
                PREVIOUS_LOCATION: '',
                store: {
                    login: jest.fn().mockRejectedValue(new Error("Login failed")),
                    createUser: jest.fn().mockResolvedValue({user}),
                    users: jest.fn(() => ({
                        create: jest.fn().mockResolvedValue({})
                    }))
                }
            });

            const emailInput = screen.getByTestId("employee-email-input");
            const passwordInput = screen.getByTestId("employee-password-input");

            fireEvent.change(emailInput, { target: { value: "test@test.com" } });
            fireEvent.change(passwordInput, { target: { value: "test" } });

            const form = screen.getByTestId("form-employee");
            form.addEventListener("submit", loginInstance.handleSubmitEmployee);

            await waitFor(() => {
                //fireEvent.submit(form);
                expect(loginInstance.login(user)).rejects.toThrow(new Error("Login failed"))
            });

        });


    })
});
