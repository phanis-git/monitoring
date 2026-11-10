
const API = "/api";

async function apiCall(endpoint, options = {}) {
    const start = performance.now();

    try {
        const response = await fetch(`${API}${endpoint}`, options);
        const data = await response.json();

        const duration = (performance.now() - start).toFixed(2);

        document.getElementById("output").textContent =
            JSON.stringify({
                http_status: response.status,
                response_time_ms: duration,
                response: data
            }, null, 2);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return data;

    } catch (error) {
        document.getElementById("output").textContent =
            "API Error: " + error.message;

        throw error;
    }
}

async function checkHealth() {
    try {
        const data = await apiCall("/health");

        document.getElementById("health").textContent =
            data.status;

        document.getElementById("hostname").textContent =
            data.hostname;

    } catch (error) {
        document.getElementById("health").textContent = "DOWN";
    }
}

async function getItems() {
    await apiCall("/items");
}

async function getStats() {
    const data = await apiCall("/stats");

    document.getElementById("requests").textContent =
        data.total_requests;

    document.getElementById("uptime").textContent =
        data.uptime_seconds + " seconds";

    document.getElementById("hostname").textContent =
        data.hostname;
}

async function createItem() {
    const name = document.getElementById("itemName").value.trim();

    if (!name) {
        alert("Please enter an item name");
        return;
    }

    try {
        await apiCall("/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name })
        });

        document.getElementById("itemName").value = "";
    } catch (error) {
        console.error(error);
    }
}

// Generate regular API traffic for monitoring
checkHealth();

setInterval(() => {
    getStats().catch(() => {});
}, 10000);
