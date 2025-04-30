import requests
import re

UUIDv7_PATTERN = re.compile(
    r'^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    re.IGNORECASE
)

def test_generate_uuid():
    res = requests.get("http://flask:5602/api/generate")
    assert res.status_code == 200
    data = res.json()
    assert "uuid" in data
    assert UUIDv7_PATTERN.match(data["uuid"])
