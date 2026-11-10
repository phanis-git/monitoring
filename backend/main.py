
from fastapi import FastAPI
from datetime import datetime, timezone
from pydantic import BaseModel
import os
import socket
import time

app = FastAPI(title="EKS Monitoring Demo API")

START_TIME = time.time()
REQUEST_COUNT = 0

items = [
    {"id": 1, "name": "Frontend Application", "status": "Running"},
    {"id": 2, "name": "Backend Application", "status": "Running"},
    {"id": 3, "name": "Prometheus Monitoring", "status": "Planned"}
]


class Item(BaseModel):
    name: str


@app.middleware("http")
async def count_requests(request, call_next):
    global REQUEST_COUNT
    REQUEST_COUNT += 1
    response = await call_next(request)
    return response


@app.get("/")
def root():
    return {
        "message": "EKS Monitoring Demo Backend",
        "status": "Running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "UP",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "hostname": socket.gethostname()
    }


@app.get("/api/items")
def get_items():
    return {
        "count": len(items),
        "items": items
    }


@app.post("/api/items")
def create_item(item: Item):
    new_item = {
        "id": len(items) + 1,
        "name": item.name,
        "status": "Created"
    }

    items.append(new_item)

    return {
        "message": "Item created successfully",
        "item": new_item
    }


@app.get("/api/stats")
def stats():
    return {
        "hostname": socket.gethostname(),
        "uptime_seconds": round(time.time() - START_TIME, 2),
        "total_requests": REQUEST_COUNT,
        "total_items": len(items)
    }
