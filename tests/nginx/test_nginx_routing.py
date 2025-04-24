import requests

def test_nginx_index():
    res = requests.get('http://nginx:8755')
    assert res.status_code == 200
