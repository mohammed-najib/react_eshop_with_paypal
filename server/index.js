var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import "dotenv/config";
import cors from "cors";
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, ENVIROMENT, PORT = 8888, } = process.env;
const base = ENVIROMENT === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
const app = express();
// // host static files
// app.use(express.static("client"));
app.use(cors());
// parse post params sent in body in json format
app.use(express.json());
/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
        const response = yield fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const data = yield response.json();
        return data.access_token;
    }
    catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
});
/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
// const createOrder = async (cart) => {
const createOrder = ({ product }) => __awaiter(void 0, void 0, void 0, function* () {
    // use the cart information passed from the front-end to calculate the purchase unit details
    console.log("shopping cart information passed from the frontend createOrder() callback:", product);
    const accessToken = yield generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: product.price,
                },
            },
        ],
    };
    const response = yield fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
        method: "POST",
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
});
/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = (orderID) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
    const response = yield fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
    });
    return handleResponse(response);
});
function handleResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jsonResponse = yield response.json();
            return {
                jsonResponse,
                httpStatusCode: response.status,
            };
        }
        catch (err) {
            const errorMessage = yield response.text();
            throw new Error(errorMessage);
        }
    });
}
app.post("/api/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // use the cart information passed from the front-end to calculate the order amount detals
        const data = req.body;
        console.log("shopping cart information passed from the frontend:", data);
        const { jsonResponse, httpStatusCode } = yield createOrder(data);
        res.status(httpStatusCode).json(jsonResponse);
    }
    catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
}));
app.post("/api/orders/:orderID/capture", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = yield captureOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    }
    catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
}));
// // serve index.html
// app.get("/", (req, res) => {
//   res.sendFile(path.resolve("./client/checkout.html"));
// });
app.listen(PORT, () => {
    console.log(`Node server listening at http://localhost:${PORT}/`);
});
