import http.client
import json
import time

def test_api():
    conn = http.client.HTTPConnection("localhost", 3000)
    headers = {'Content-Type': 'application/json'}
    
    payload = json.dumps({
        "title": "Test Product",
        "price": 1299,
        "stock": 10,
        "sku": "TST-001"
    })
    conn.request("POST", "/api/products", payload, headers)
    res = conn.getresponse()
    data = res.read().decode()
    product_id = json.loads(data)['id']
    print("Created Product:", product_id)
    
    payload = json.dumps({
        "customer": {"name": "Test Customer", "email": "test@test.com"},
        "items": [{"productId": product_id, "qty": 2}],
        "total": 2598
    })
    conn.request("POST", "/api/orders", payload, headers)
    res = conn.getresponse()
    print("Create Order:", res.status, res.read().decode())

test_api()
