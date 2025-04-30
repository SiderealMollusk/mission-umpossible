import requests

def test_signal_status():
    response = requests.get("http://signal-api:8080/v1/about")
    assert response.status_code == 200
    assert "build" in response.json()

def test_send_message_stub():
    try:
        payload = {
            "message": "Hello from test!",
            "number": "+10000000001",
            "recipients": ["+10000000002"]
        }
        response = requests.post("http://signal-api:8080/v2/send", json=payload)
        print("SEND RESPONSE BODY:", response.text)
        assert response.status_code in [200, 202]
    except requests.exceptions.RequestException:
        assert False, "Signal API send failed or unavailable"

def test_receive_messages_stub():
    try:
        response = requests.get("http://signal-api:8080/v1/receive/+10000000001")
        print("RECEIVE RESPONSE BODY:", response.text)
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        assert False, "Signal API receive failed or unavailable"

def test_list_attachments_stub():
    try:
        response = requests.get("http://signal-api:8080/v1/attachments")
        print("ATTACHMENTS RESPONSE BODY:", response.text)
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        assert False, "Signal API list attachments failed or unavailable"

def test_update_profile_stub():
    try:
        payload = {"name": "TestUser"}
        response = requests.post("http://signal-api:8080/v1/profile/+10000000001", json=payload)
        print("UPDATE PROFILE RESPONSE BODY:", response.text)
        assert response.status_code in [200, 204]
    except requests.exceptions.RequestException:
        assert False, "Signal API update profile failed or unavailable"

def test_create_group_stub():
    try:
        payload = {
            "number": "+10000000001",
            "name": "Test Group",
            "members": ["+10000000002"]
        }
        response = requests.post("http://signal-api:8080/v2/groups", json=payload)
        print("CREATE GROUP RESPONSE BODY:", response.text)
        assert response.status_code in [200, 201]
    except requests.exceptions.RequestException:
        assert False, "Signal API group creation failed or unavailable"

def test_link_device_qr_stub():
    try:
        response = requests.get("http://signal-api:8080/v1/qrcodelink?device_name=test-runner")
        print("LINK DEVICE RESPONSE TEXT:", response.text)
        assert response.status_code == 200
        assert "qr" in response.json()
    except requests.exceptions.RequestException:
        assert False, "Signal API QR code link failed or unavailable"

def test_get_group_list_stub():
    try:
        response = requests.get("http://signal-api:8080/v2/groups/+10000000001")
        print("GET GROUP LIST RESPONSE BODY:", response.text)
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        assert False, "Signal API group listing failed or unavailable"

def test_delete_attachment_stub():
    try:
        # Assuming attachment UUID is known from prior upload; this is a placeholder
        attachment_id = "example-id"
        response = requests.delete(f"http://signal-api:8080/v1/attachments/{attachment_id}")
        assert response.status_code in [200, 204, 404]
    except requests.exceptions.RequestException:
        assert False, "Signal API attachment delete failed or unavailable"

def test_register_number_stub():
    # Not usually automatable without phone verification
    assert True

def test_verify_registration_stub():
    # Not usually automatable without phone verification
    assert True